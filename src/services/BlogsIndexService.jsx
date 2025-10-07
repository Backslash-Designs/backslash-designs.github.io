// Runtime fetch for blogs index (blogs.json) from a GitHub repo.
// Falls back to the statically bundled `src/pages/blog/blogs.json` if remote fetch fails.
// Config via Vite env vars (must be prefixed with VITE_ to be exposed client-side):
//   VITE_BLOGS_OWNER
//   VITE_BLOGS_REPO
//   VITE_BLOGS_PATH   (e.g. index.json)
//   VITE_BLOGS_REF    (e.g. master / main / commit SHA)
//
// NOTE: If you add VITE_BLOGS_GH_TOKEN (a GitHub PAT) it WILL be exposed client-side.
// Prefer build-time prefetch or a serverless proxy for private repos. Token support
// here is strictly for internal/dev scenarios. The service will attempt an
// authenticated GitHub API call first when a token is present, then fall back to
// unauthenticated CDN/raw URLs, then to the bundled local file.
//
// Exports:
//   fetchBlogsIndex(force?: boolean) -> Promise<{ entries: any[], source: string }>
//   useBlogsIndex(options?) React hook for components.
//
// Simple in-memory cache to avoid refetching during a single session.

import { useEffect, useState, useCallback } from "react";

let _cache = { data: null, ts: 0 };
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function buildRawUrl() {
  const owner = import.meta.env.VITE_BLOGS_OWNER;
  const repo = import.meta.env.VITE_BLOGS_REPO;
  const path = import.meta.env.VITE_BLOGS_PATH || "index.json";
  const ref = import.meta.env.VITE_BLOGS_REF || "master";
  if (!owner || !repo) return null;
  // Use jsDelivr (fast CDN) fallback to raw.githubusercontent
  const raw1 = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${path}`;
  const raw2 = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
  return [raw1, raw2];
}

async function loadLocalFallback() {
  try {
    const mod = await import(/* @vite-ignore */ "../pages/blog/blogs.json");
    return { entries: mod.default || mod, source: "local" };
  } catch (e) {
    console.warn("BlogsIndexService: local fallback failed", e);
    return { entries: [], source: "empty" };
  }
}

export async function fetchBlogsIndex(force = false) {
  const now = Date.now();
  if (!force && _cache.data && now - _cache.ts < CACHE_TTL_MS) {
    return { ..._cache.data, source: _cache.data.source || "cache" };
  }

  const urls = buildRawUrl();
  if (!urls) {
    return await loadLocalFallback();
  }

  const owner = import.meta.env.VITE_BLOGS_OWNER;
  const repo = import.meta.env.VITE_BLOGS_REPO;
  const path = import.meta.env.VITE_BLOGS_PATH || "index.json";
  const ref = import.meta.env.VITE_BLOGS_REF || "master";
  const token = import.meta.env.VITE_BLOGS_GH_TOKEN; // DANGER: exposed in client

  // 1. Try GitHub API (authenticated) if token is present
  if (token && owner && repo) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github.raw",
          Authorization: `Bearer ${token}`,
        },
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      let entries;
      if (Array.isArray(json)) entries = json;
      else if (Array.isArray(json?.posts)) entries = json.posts;
      else if (Array.isArray(json?.entries)) entries = json.entries;
      else if (json && typeof json === "object") entries = [json];
      else entries = [];
      const data = { entries, source: "github-api" };
      _cache = { data, ts: Date.now() };
      return data;
    } catch (e) {
      console.warn("BlogsIndexService: GitHub API (token) fetch failed", e);
    }
  }

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  // Accept several shapes:
  // 1. Array -> posts array
  // 2. { posts: [...] }
  // 3. { entries: [...] }
  // 4. Single object with .posts nested
  let entries;
  if (Array.isArray(json)) entries = json;
  else if (Array.isArray(json?.posts)) entries = json.posts;
  else if (Array.isArray(json?.entries)) entries = json.entries;
  else if (json && typeof json === "object") entries = [json];
  else entries = [];
  const data = { entries, source: url };
      _cache = { data, ts: Date.now() };
      return data;
    } catch (e) {
      console.warn("BlogsIndexService: fetch attempt failed", url, e);
    }
  }

  const fallback = await loadLocalFallback();
  _cache = { data: fallback, ts: Date.now() };
  return fallback;
}

export function useBlogsIndex({ refreshIntervalMs = 0, immediate = true } = {}) {
  const [state, setState] = useState({ loading: !!immediate, error: null, entries: [], source: null });

  const load = useCallback(async (force = false) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetchBlogsIndex(force);
      setState({ loading: false, error: null, ...data });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e }));
    }
  }, []);

  useEffect(() => {
    if (immediate) load();
  }, [immediate, load]);

  useEffect(() => {
    if (refreshIntervalMs > 0) {
      const id = setInterval(() => load(true), refreshIntervalMs);
      return () => clearInterval(id);
    }
  }, [refreshIntervalMs, load]);

  return {
    ...state,
    reload: () => load(true),
    // convenience booleans
    isEmpty: !state.loading && !state.error && state.entries.length === 0,
  };
}

// Utility to clear cache (e.g., for testing or manual refresh beyond hook)
export function _invalidateBlogsIndexCache() {
  _cache = { data: null, ts: 0 };
}
