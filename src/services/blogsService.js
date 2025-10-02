// Minimal GitHub file fetcher with optional auth and ETag caching.
// Security model:
// - Token is ONLY read from process.env at runtime (Node/build). It is never read from Vite's public env.
// - In the browser (static site), no token is used; calls to private repos will safely fail and null is returned.
// Usage:
//   const data = await fetchBlogsJSON({ owner, repo, path: "blogs.json", ref: "main" });
//
// CI example (GitHub Actions):
//   - Store a fine-grained PAT as secret BLOGS_GH_TOKEN with: Repository permissions -> Contents: Read-only
//   - Build step: BLOGS_GH_TOKEN=${{ secrets.BLOGS_GH_TOKEN }} npm run build

const isServer = typeof window === "undefined";

// Read a token ONLY from process.env at runtime (Node). Do not use Vite's public env.
function getToken() {
  if (!isServer) return undefined;
  const env = (globalThis.process && globalThis.process.env) || {};
  return env.BLOGS_GH_TOKEN || env.GITHUB_TOKEN || env.GH_TOKEN || undefined;
}

// Simple in-memory cache for current process
const cache = new Map(); // key -> { etag, data }

async function fetchGithubFileRaw({ owner, repo, path, ref = "main", token = getToken() } = {}) {
  if (!owner || !repo || !path) throw new Error("owner, repo, and path are required");

  const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repo
  )}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(ref)}`;

  const key = apiUrl;
  const cached = cache.get(key);

  const headers = {
    Accept: "application/vnd.github.raw",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (cached?.etag) headers["If-None-Match"] = cached.etag;

  const res = await fetch(apiUrl, { headers });

  // Private repo from browser -> 401/404 likely; return null (caller can fall back)
  if (res.status === 304 && cached) return cached.data;
  if (!res.ok) return null;

  const etag = res.headers.get("etag") || null;
  // Content is raw file. If it's JSON, parse it; otherwise return text.
  const contentType = res.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  cache.set(key, { etag, data });
  return data;
}

export async function fetchBlogsJSON(opts) {
  const data = await fetchGithubFileRaw(opts);
  if (!data) return null;
  // Expect a JSON object that may contain a "posts" array
  return data;
}
