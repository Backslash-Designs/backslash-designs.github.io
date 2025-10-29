// Service: BlogCoverImageService
// Purpose: Resolve a blog post's YAML/JSON `cover` field into a usable image URL.
// The cover field in your posts/index appears like: "[[Backslash-Logo-Square-Dark.png]]"
// This service will:
//   1. Parse wiki-link style cover strings (supports multiple like: "[[one.png]] [[two.jpg]]")
//   2. Build candidate remote URLs (jsDelivr + raw.githubusercontent) pointing to the `media/` folder
//      of the same repository configured for blog index (VITE_BLOGS_OWNER / VITE_BLOGS_REPO / VITE_BLOGS_REF)
//   3. (Optionally) probe the URLs (HEAD) to pick the first reachable one (default on)
//   4. Provide a React hook `useCoverImage` for components
//   5. Fallback to a local placeholder image (public/backslash-logo.png) if nothing resolves
//
// Environment variables used (same pattern as BlogsIndexService):
//   VITE_BLOGS_OWNER
//   VITE_BLOGS_REPO
//   VITE_BLOGS_REF   (default: master)
//   (Optional) VITE_BLOGS_GH_TOKEN (for private repos; exposed client-side - caution!)
//
// Exports:
//   parseCoverFilenames(coverValue: string | string[] | null) -> string[]
//   buildMediaUrls(filename: string) -> string[] (ordered candidates)
//   resolveCoverImage(coverValue, options?) -> Promise<{ url, filename, source, tried: string[] }>
//   useCoverImage(coverValue, options?) -> hook state { loading, error, url, filename, source, tried, reload }
//
// Notes:
// - We intentionally keep probing lightweight (HEAD with 5s timeout per candidate) and cache outcomes in-memory.
// - If `probe` is set to false, we just return the first candidate URL without verifying existence.
// - Sanitization restricts filenames to a safe pattern (no path traversal / slashes).

import { useCallback, useEffect, useState } from "react";

const _existenceCache = new Map(); // key: url -> boolean
const DEFAULT_FALLBACK = "/backslash-logo.png"; // must exist in public/
const PROBE_TIMEOUT_MS = 5000;

function getRepoConfig() {
  return {
    owner: import.meta.env.VITE_BLOGS_OWNER || null,
    repo: import.meta.env.VITE_BLOGS_REPO || null,
    ref: import.meta.env.VITE_BLOGS_REF || "master",
    token: import.meta.env.VITE_BLOGS_GH_TOKEN || null, // exposed client-side (dev only)
  };
}

// 1. Parse cover field(s) into filenames
export function parseCoverFilenames(coverValue) {
  if (!coverValue) return [];
  let raw = coverValue;
  if (Array.isArray(raw)) raw = raw.join(" ");
  if (typeof raw !== "string") return [];
  // Support wiki-links [[file.png]] possibly multiple; fallback: raw token if it looks like a file
  const matches = [...raw.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1].trim());
  let candidates = matches.length ? matches : [raw.trim()];
  // Sanitize & filter
  candidates = candidates.filter(f => /^[A-Za-z0-9._\-]+$/.test(f));
  // Remove duplicates while preserving order
  return [...new Set(candidates)];
}

// 2. Build candidate URLs for a single filename
export function buildMediaUrls(filename) {
  const { owner, repo, ref } = getRepoConfig();
  if (!owner || !repo || !filename) return [];
  const path = `media/${filename}`;
  // jsDelivr CDN first, raw fallback
  return [
    `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${encodeURIComponent(ref)}/${path}`,
    `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(ref)}/${path}`,
  ];
}

async function probeUrl(url, token) {
  if (_existenceCache.has(url)) return _existenceCache.get(url);

  // Only send Authorization for api.github.com (NOT for CDN/raw which would cause preflight failures)
  const isApi = url.includes("api.github.com");
  const headers = { Accept: "image/*" };
  if (isApi && token) headers.Authorization = `Bearer ${token}`;

  // Strategy 1: HEAD request (fast metadata) — may be blocked by some CDNs; ignore CORS/preflight errors
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal, headers });
    clearTimeout(t);
    if (res.ok) {
      _existenceCache.set(url, true);
      return true;
    }
  } catch (e) {
    // swallow; will attempt image fallback
  }

  // Strategy 2: Create an Image object. This bypasses many CORS issues for simple GETs.
  // We can't distinguish all error codes, but onload/onerror gives us a signal.
  const exists = await new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = ""; // abort
      resolve(false);
    }, PROBE_TIMEOUT_MS);
    img.onload = () => { clearTimeout(timer); resolve(true); };
    img.onerror = () => { clearTimeout(timer); resolve(false); };
    // Use cache-busting param to avoid stale negative caching during dev
    const cacheBust = url.includes("?") ? `&cb=${Date.now()}` : `?cb=${Date.now()}`;
    img.src = url + cacheBust;
  });
  _existenceCache.set(url, exists);
  return exists;
}

// 3. Resolve cover value to a URL
export async function resolveCoverImage(coverValue, { probe = true, fallback = DEFAULT_FALLBACK } = {}) {
  const filenames = parseCoverFilenames(coverValue);
  const { token } = getRepoConfig();
  const tried = [];

  for (const fname of filenames) {
    const urls = buildMediaUrls(fname);
    for (const url of urls) {
      tried.push(url);
      if (!probe) {
        return { url, filename: fname, source: "constructed", tried };
      }
      const exists = await probeUrl(url, token);
      if (exists) {
        return { url, filename: fname, source: url, tried };
      }
    }
  }

  // Fallback
  return { url: fallback, filename: filenames[0] || null, source: "fallback", tried };
}

// 4. React hook
export function useCoverImage(coverValue, { immediate = true, probe = true, fallback = DEFAULT_FALLBACK } = {}) {
  const hasCover = !!coverValue;
  const [state, setState] = useState(
    hasCover
      ? { loading: !!(immediate && hasCover), error: null, url: null, filename: null, source: null, tried: [] }
      : { loading: false, error: null, url: fallback, filename: null, source: "no-cover", tried: [] }
  );

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await resolveCoverImage(coverValue, { probe, fallback });
      setState({ loading: false, error: null, ...result });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e }));
    }
  }, [coverValue, probe, fallback]);

  useEffect(() => {
    if (immediate && hasCover) load();
  }, [immediate, hasCover, load]);

  return {
    ...state,
    reload: load,
    isFallback: state.source === "fallback",
  };
}

// 5. Utility to clear the in-memory existence cache (e.g., for tests)
export function _invalidateCoverImageCache() {
  _existenceCache.clear();
}

// Optional: simple prefetch helper (best-effort)
export function prefetchCoverImage(coverValue) {
  resolveCoverImage(coverValue, { probe: true }).then(r => {
    if (r.url && r.source !== "fallback") {
      const img = new Image();
      img.src = r.url;
    }
  }).catch(() => {});
}
