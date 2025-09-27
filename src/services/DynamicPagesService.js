import multi from "../pages/dynamic/multi.pages.json";

const STORAGE_KEY = "dynamic.pages.v1";
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

let state = {
  pages: Array.isArray(multi?.pages) ? multi.pages : [],
};

function readStorage() {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.pages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(next) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function dispatchChange() {
  if (!isBrowser) return;
  const detail = getState();
  window.dispatchEvent(new CustomEvent("dynamic-pages-change", { detail }));
}

// initialize from localStorage if present
const stored = readStorage();
if (stored) state = stored;

function getState() {
  return state;
}

/* ---------- Reads ---------- */
export function getPages() {
  return getState().pages;
}

export function getPageByPath(path) {
  return getPages().find((p) => p.path === path) || null;
}

export function getPageByName(name) {
  return getPages().find((p) => p.name === name) || null;
}

export function ensurePage({ path, name }) {
  return (path && getPageByPath(path)) || (name && getPageByName(name)) || null;
}

/* ---------- Writes (temporary, client-side) ---------- */
export function setPages(pages) {
  state = { pages: Array.isArray(pages) ? [...pages] : [] };
  writeStorage(state);
  dispatchChange();
}

export function updatePages(updater) {
  const next = typeof updater === "function" ? updater([...getPages()]) : updater;
  setPages(next);
}

export function upsertPage(page) {
  if (!page || (typeof page !== "object")) return;
  const pages = [...getPages()];
  const idx = pages.findIndex((p) => p.path === page.path || p.name === page.name);
  if (idx >= 0) pages[idx] = { ...pages[idx], ...page };
  else pages.push(page);
  setPages(pages);
}

export function removePageByPath(path) {
  const pages = getPages().filter((p) => p.path !== path);
  setPages(pages);
}

export function resetToFile() {
  // Clear persisted edits and restore to repository JSON
  if (isBrowser) {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }
  state = { pages: Array.isArray(multi?.pages) ? multi.pages : [] };
  dispatchChange();
}

export function exportPages() {
  // For debugging/exporting current state
  try {
    return JSON.stringify(getState(), null, 2);
  } catch {
    return "{}";
  }
}

/* ---------- Subscriptions ---------- */
export function subscribe(listener) {
  if (!isBrowser || typeof listener !== "function") {
    return () => {};
  }
  const handler = (e) => {
    const data = e?.detail || getState();
    listener(data);
  };
  window.addEventListener("dynamic-pages-change", handler);
  return () => window.removeEventListener("dynamic-pages-change", handler);
}

export default {
  getPages,
  getPageByPath,
  getPageByName,
  ensurePage,
  setPages,
  updatePages,
  upsertPage,
  removePageByPath,
  resetToFile,
  exportPages,
  subscribe,
};
