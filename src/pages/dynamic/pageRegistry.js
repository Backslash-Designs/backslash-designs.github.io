import multi from "./multi.pages.json";

export function getPages() {
  return multi.pages || [];
}

export function getPageByPath(path) {
  return getPages().find(p => p.path === path);
}

export function getPageByName(name) {
  return getPages().find(p => p.name === name);
}

export function ensurePage({ path, name }) {
  return (path && getPageByPath(path)) || (name && getPageByName(name)) || null;
}

export default { getPages, getPageByPath, getPageByName, ensurePage };

