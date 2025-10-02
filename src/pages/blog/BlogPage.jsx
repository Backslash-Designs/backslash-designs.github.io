import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import ReactMarkdown from "react-markdown";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import { TEAM } from "../about/Team.jsx";
import BLOG_DB from "./blogs.json"; // NEW
import { fetchBlogsJSON } from "../../services/blogsService.js"; // NEW

// REPLACE the hardcoded POSTS with a mapper + fallback
const mapDbToPosts = (db) =>
  (db?.posts || []).map((p, i) => {
    const key = p.slug || p.file || `post-${i}`;
    const title = p.title || p.aliases || key;
    const date = p.posted_date || p.created_date || p.date || null;
    const excerpt = p.summary || "";
    const contentMd = p.body || "";
    const author = Array.isArray(p.author) ? (p.author[0] || "") : (p.author || "");
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const values = Array.isArray(p.values) ? p.values : [];
    const vendors = Array.isArray(p.vendors) ? p.vendors : [];
    const technologies = Array.isArray(p.technologies) ? p.technologies : [];
    const other = Array.isArray(p.other) ? p.other : Array.isArray(p.others) ? p.others : [];
    return { key, title, date, excerpt, contentMd, author, tags, values, vendors, technologies, other };
  });

// Fallback at build-time; remote (if available) will override inside component
export const POSTS_FALLBACK = mapDbToPosts(BLOG_DB);

// Map markdown elements to MUI components
const mdComponents = {
  h1: ({ node, ...props }) => (
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 2, mb: 1 }} {...props} />
  ),
  h2: ({ node, ...props }) => (
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }} {...props} />
  ),
  h3: ({ node, ...props }) => (
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }} {...props} />
  ),
  p: ({ node, ...props }) => (
      <Typography variant="body2" sx={{ mb: 1.25, opacity: 0.95 }} {...props} />
  ),
  a: ({ node, href, ...props }) => (
      <Link href={href} target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 3, mb: 1.25 }} {...props} />,
  ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 3, mb: 1.25 }} {...props} />,
  li: ({ node, ...props }) => (
      <li>
      <Typography variant="body2" component="span" sx={{ opacity: 0.95 }} {...props} />
      </li>
  ),
  code: ({ inline, children, ...props }) =>
      inline ? (
      <Box
          component="code"
          sx={{
          px: 0.5,
          py: 0.1,
          borderRadius: 0.5,
          bgcolor: (t) => t.palette.action.hover,
          fontFamily:
              '"Hack", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
          fontSize: "0.85em",
          }}
          {...props}
      >
          {children}
      </Box>
      ) : (
      <Box
          component="pre"
          sx={{
          p: 1.25,
          borderRadius: 1,
          overflowX: "auto",
          bgcolor: (t) => t.palette.action.hover,
          }}
          {...props}
      >
          <Box
          component="code"
          sx={{
              display: "block",
              fontFamily:
              '"Hack", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
              fontSize: "0.9em",
          }}
          >
          {children}
          </Box>
      </Box>
      ),
};

const PER_PAGE = 4;

// NEW: helpers for filtering/sorting
const SORT_DEFAULT = "date-desc"; // "date-desc" | "date-asc" | "title-asc" | "title-desc"
const normalize = (s) => (s || "").toString().toLowerCase().trim();
const mdToPlain = (md = "") =>
    md
        .replace(/```[\s\S]*?```/g, " ") // fenced blocks
        .replace(/`([^`]+)`/g, "$1") // inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
        .replace(/[*_~>#-]/g, " ") // md punctuation
        .replace(/\s+/g, " ")
        .trim();

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        });
    } catch {
        return iso;
    }
}

export default function BlogPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // NEW: optionally load blogs.json from a private GitHub repo at runtime.
  // Note: No token is used in the browser; private repos will safely return null and we will fall back.
  const GH_CFG = React.useMemo(
    () => ({
      owner: import.meta.env.VITE_BLOGS_OWNER,
      repo: import.meta.env.VITE_BLOGS_REPO,
      path: import.meta.env.VITE_BLOGS_PATH || "src/pages/blog/blogs.json",
      ref: import.meta.env.VITE_BLOGS_REF || "main",
    }),
    []
  );
  const [remoteDb, setRemoteDb] = React.useState(null);

  React.useEffect(() => {
    // NEW: only attempt client-side fetch if explicitly enabled (for public repos)
    const allowClientFetch = import.meta.env.VITE_BLOGS_CLIENT_FETCH === "1";
    if (!allowClientFetch) return;
    if (!GH_CFG.owner || !GH_CFG.repo || !GH_CFG.path) return;

    let cancelled = false;
    fetchBlogsJSON(GH_CFG)
      .then((db) => {
        if (!cancelled && db?.posts) setRemoteDb(db);
      })
      .catch(() => {
        /* ignore and keep fallback */
      });
    return () => { cancelled = true; };
  }, [GH_CFG]);
  
  // Use remote if available, otherwise fallback
  const posts = React.useMemo(() => (remoteDb ? mapDbToPosts(remoteDb) : POSTS_FALLBACK), [remoteDb]);

  // Derive initial filter state from URL (fix: define sp0 before using it)
  const sp0 = React.useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [query, setQuery] = React.useState(sp0.get("q") ?? "");
  const [selectedTags, setSelectedTags] = React.useState(
    (sp0.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [selectedAuthors, setSelectedAuthors] = React.useState(
    (sp0.get("authors") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [selectedValues, setSelectedValues] = React.useState(
    (sp0.get("values") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [selectedVendors, setSelectedVendors] = React.useState(
    (sp0.get("vendors") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [selectedTech, setSelectedTech] = React.useState(
    (sp0.get("tech") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [selectedOther, setSelectedOther] = React.useState(
    (sp0.get("other") || "").split(",").map((t) => t.trim()).filter(Boolean)
  );
  const [sortBy, setSortBy] = React.useState(sp0.get("sort") || SORT_DEFAULT);

  const [page, setPage] = React.useState(1);
  const [expanded, setExpanded] = React.useState(null);

  // Keep local filters in sync with URL edits/back/forward (extended)
  React.useEffect(() => {
      const sp = new URLSearchParams(location.search);
      const q = sp.get("q") ?? "";
      const tags = (sp.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const authors = (sp.get("authors") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const values = (sp.get("values") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const vendors = (sp.get("vendors") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const tech = (sp.get("tech") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const other = (sp.get("other") || "").split(",").map((t) => t.trim()).filter(Boolean);
      const sort = sp.get("sort") || SORT_DEFAULT;

      if (q !== query) setQuery(q);
      if (tags.join(",") !== selectedTags.join(",")) setSelectedTags(tags);
      if (authors.join(",") !== selectedAuthors.join(",")) setSelectedAuthors(authors);
      if (values.join(",") !== selectedValues.join(",")) setSelectedValues(values);
      if (vendors.join(",") !== selectedVendors.join(",")) setSelectedVendors(vendors);
      if (tech.join(",") !== selectedTech.join(",")) setSelectedTech(tech);
      if (other.join(",") !== selectedOther.join(",")) setSelectedOther(other);
      if (sort !== sortBy) setSortBy(sort);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // All unique vocabularies (alpha)
  const allTags = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const allAuthors = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => p.author && set.add(p.author));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const allValues = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => (p.values || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const allVendors = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => (p.vendors || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const allTech = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => (p.technologies || [])?.forEach?.((t) => set.add(t)));
    if (set.size === 0) posts.forEach((p) => (p.technologies || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);
  const allOther = React.useMemo(() => {
    const set = new Set(); posts.forEach((p) => (p.other || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Author lookup
  const authorsByName = React.useMemo(() => {
      const map = new Map();
      TEAM.forEach((m) => map.set(m.name, m));
      return map;
  }, []);
  const defaultAuthorName = TEAM[0]?.name;

  // Filter + sort (extended)
  const filteredPosts = React.useMemo(() => {
      const q = normalize(query);
      const hasTags = selectedTags.length > 0;
      const hasAuthors = selectedAuthors.length > 0;
      const hasValues = selectedValues.length > 0;
      const hasVendors = selectedVendors.length > 0;
      const hasTech = selectedTech.length > 0;
      const hasOther = selectedOther.length > 0;

      let list = posts.filter((p) => {
      // search across multiple fields
      const inTitle = normalize(p.title).includes(q);
      const inExcerpt = normalize(p.excerpt).includes(q);
      const inMd = normalize(mdToPlain(p.contentMd)).includes(q);
      const inTags = (p.tags || []).some((t) => normalize(t).includes(q));
      const inAuthor = normalize(p.author || defaultAuthorName || "").includes(q);
      const inValues = (p.values || []).some((t) => normalize(t).includes(q));
      const inVendors = (p.vendors || []).some((t) => normalize(t).includes(q));
      const inTech = (p.technologies || []).some((t) => normalize(t).includes(q));
      const inOther = (p.other || []).some((t) => normalize(t).includes(q));
      const matchesSearch = !q || inTitle || inExcerpt || inMd || inTags || inAuthor || inValues || inVendors || inTech || inOther;

      // tag filter (ANY-of per group)
      const matchesTags = !hasTags || (p.tags || []).some((t) => selectedTags.includes(t));
      const matchesAuthors = !hasAuthors || (p.author ? selectedAuthors.includes(p.author) : false);
      const matchesValues = !hasValues || (p.values || []).some((t) => selectedValues.includes(t));
      const matchesVendors = !hasVendors || (p.vendors || []).some((t) => selectedVendors.includes(t));
      const matchesTech = !hasTech || (p.technologies || []).some((t) => selectedTech.includes(t));
      const matchesOther = !hasOther || (p.other || []).some((t) => selectedOther.includes(t));

      return matchesSearch && matchesTags && matchesAuthors && matchesValues && matchesVendors && matchesTech && matchesOther;
      });

      // sort
      switch (sortBy) {
      case "date-asc":
          list = list.slice().sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
          break;
      case "title-asc":
          list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
          break;
      case "title-desc":
          list = list.slice().sort((a, b) => b.title.localeCompare(a.title));
          break;
      case "date-desc":
      default:
          list = list.slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          break;
      }

    return list;
  }, [posts, query, selectedTags, selectedAuthors, selectedValues, selectedVendors, selectedTech, selectedOther, sortBy, defaultAuthorName]);

  // total pages depends on current filters
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));

  // Sync page with URL and clamp to totalPages
  React.useEffect(() => {
    const sp = new URLSearchParams(location.search);
    let p = Number(sp.get("page") || "1");
    if (!Number.isFinite(p) || p < 1) p = 1;
    p = Math.min(totalPages, p);
    if (p !== page) setPage(p);
  }, [location.search, totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hash deep-linking: ensure correct page, then scroll and expand
  React.useEffect(() => {
    const hashKey = location.hash?.slice(1) || null;
    setExpanded(hashKey || null);
    if (!hashKey) return;

    const idx = filteredPosts.findIndex((p) => p.key === hashKey);
    if (idx === -1) return;

    const needPage = Math.floor(idx / PER_PAGE) + 1;
    if (needPage !== page) {
      const sp = new URLSearchParams(location.search);
      sp.set("page", String(needPage));
      navigate(`/blog?${sp.toString()}#${hashKey}`, { replace: true });
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(hashKey)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash, page, location.search, filteredPosts, navigate]);

  // Helpers to push URL updates (preserve hash when appropriate) — extended
  const pushFilters = React.useCallback(
    (
      {
        q = query,
        tags = selectedTags,
        authors = selectedAuthors,
        values = selectedValues,
        vendors = selectedVendors,
        tech = selectedTech,
        other = selectedOther,
        sort = sortBy,
        page = 1,
      },
      { replace = true, keepHash = false } = {}
    ) => {
      const sp = new URLSearchParams(location.search);
      if (q) sp.set("q", q); else sp.delete("q");
      if (tags?.length) sp.set("tags", tags.join(",")); else sp.delete("tags");
      if (authors?.length) sp.set("authors", authors.join(",")); else sp.delete("authors");
      if (values?.length) sp.set("values", values.join(",")); else sp.delete("values");
      if (vendors?.length) sp.set("vendors", vendors.join(",")); else sp.delete("vendors");
      if (tech?.length) sp.set("tech", tech.join(",")); else sp.delete("tech");
      if (other?.length) sp.set("other", other.join(",")); else sp.delete("other");
      if (sort && sort !== SORT_DEFAULT) sp.set("sort", sort); else sp.delete("sort");
      sp.set("page", String(page));
      const hash = keepHash && expanded ? `#${expanded}` : "";
      const url = `/blog?${sp.toString()}${hash}`;
      const curr = `${location.pathname}${location.search}${location.hash}`;
      if (url !== curr) navigate(url, { replace });
    },
    [location.search, location.pathname, expanded, navigate, query, selectedTags, selectedAuthors, selectedValues, selectedVendors, selectedTech, selectedOther, sortBy]
  );

  // Open/close posts
  const openPost = (key) => {
    setExpanded(key);
    const sp = new URLSearchParams(location.search);
    sp.set("page", String(page));
    navigate(`/blog?${sp.toString()}#${key}`, { replace: false });
  };
  const closePost = () => {
    setExpanded(null);
    const sp = new URLSearchParams(location.search);
    sp.set("page", String(page));
    navigate(`/blog?${sp.toString()}`, { replace: false });
  };

  // Pagination change
  const handlePageChange = (_e, value) => {
    setPage(value);
    pushFilters({ page: value }, { replace: false, keepHash: true });
  };

  // NEW: filter handlers
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setExpanded(null);
    pushFilters(
      { q: val, tags: selectedTags, authors: selectedAuthors, values: selectedValues, vendors: selectedVendors, tech: selectedTech, other: selectedOther, sort: sortBy, page: 1 },
      { replace: true, keepHash: false }
    );
  };
  const handleTagsChange = (e) => {
    const val = e.target.value;
    setSelectedTags(val);
    setExpanded(null);
    pushFilters({ tags: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleAuthorsChange = (e) => {
    const val = e.target.value;
    setSelectedAuthors(val);
    setExpanded(null);
    pushFilters({ authors: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleValuesChange = (e) => {
    const val = e.target.value;
    setSelectedValues(val);
    setExpanded(null);
    pushFilters({ values: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleVendorsChange = (e) => {
    const val = e.target.value;
    setSelectedVendors(val);
    setExpanded(null);
    pushFilters({ vendors: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleTechChange = (e) => {
    const val = e.target.value;
    setSelectedTech(val);
    setExpanded(null);
    pushFilters({ tech: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleOtherChange = (e) => {
    const val = e.target.value;
    setSelectedOther(val);
    setExpanded(null);
    pushFilters({ other: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    setExpanded(null);
    pushFilters({ sort: val, page: 1 }, { replace: false, keepHash: false });
  };
  const handleReset = () => {
    setQuery("");
    setSelectedTags([]);
    setSelectedAuthors([]);
    setSelectedValues([]);
    setSelectedVendors([]);
    setSelectedTech([]);
    setSelectedOther([]);
    setSortBy(SORT_DEFAULT);
    setExpanded(null);
    pushFilters(
      { q: "", tags: [], authors: [], values: [], vendors: [], tech: [], other: [], sort: SORT_DEFAULT, page: 1 },
      { replace: false, keepHash: false }
    );
  };

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pagePosts = filteredPosts.slice(start, end);

  return (
    <Box className="test" component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Paper
          component="section"
          square
          elevation={1}
          sx={{
            position: "relative",
            left: "50%",
            right: "50%",
            ml: "-50vw",
            mr: "-50vw",
            width: "100vw",
            bgcolor: "secondary.main",
            py: { xs: 2, sm: 3 },
            mb: 2,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Box sx={{ px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: 1100, mx: "auto" }}>
              {/* ADDED: title inside the band */}
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
                Blog
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
                Updates, notes, and announcements from Backslash Designs — release highlights,
                field tips, and what we’re working on.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* NEW: Filters toolbar */}
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            mb: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto auto auto" },
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            label="Search"
            placeholder="Search posts…"
            value={query}
            onChange={handleQueryChange}
            fullWidth
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={selectedTags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "All tags")}
            >
              {allTags.map((t) => (
                <MenuItem key={t} value={t}>
                  <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="authors-label">Authors</InputLabel>
            <Select
              labelId="authors-label"
              multiple
              value={selectedAuthors}
              onChange={handleAuthorsChange}
              input={<OutlinedInput label="Authors" />}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "All authors")}
            >
              {allAuthors.map((t) => (
                <MenuItem key={t} value={t}>
                  <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 } }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select labelId="sort-label" value={sortBy} label="Sort by" onChange={handleSortChange}>
              <MenuItem value="date-desc">Newest</MenuItem>
              <MenuItem value="date-asc">Oldest</MenuItem>
              <MenuItem value="title-asc">Title A–Z</MenuItem>
              <MenuItem value="title-desc">Title Z–A</MenuItem>
            </Select>
          </FormControl>

          {/* Row 2: Values, Vendors, Tech, Other */}
          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" }, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 1 }}>
            <FormControl size="small">
              <InputLabel id="values-label">Values</InputLabel>
              <Select
                labelId="values-label"
                multiple
                value={selectedValues}
                onChange={handleValuesChange}
                input={<OutlinedInput label="Values" />}
                renderValue={(selected) => (selected.length ? selected.join(", ") : "All values")}
              >
                {allValues.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel id="vendors-label">Vendors</InputLabel>
              <Select
                labelId="vendors-label"
                multiple
                value={selectedVendors}
                onChange={handleVendorsChange}
                input={<OutlinedInput label="Vendors" />}
                renderValue={(selected) => (selected.length ? selected.join(", ") : "All vendors")}
              >
                {allVendors.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel id="tech-label">Technologies</InputLabel>
              <Select
                labelId="tech-label"
                multiple
                value={selectedTech}
                onChange={handleTechChange}
                input={<OutlinedInput label="Technologies" />}
                renderValue={(selected) => (selected.length ? selected.join(", ") : "All technologies")}
              >
                {allTech.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel id="other-label">Other</InputLabel>
              <Select
                labelId="other-label"
                multiple
                value={selectedOther}
                onChange={handleOtherChange}
                input={<OutlinedInput label="Other" />}
                renderValue={(selected) => (selected.length ? selected.join(", ") : "All other")}
              >
                {allOther.map((t) => (
                  <MenuItem key={t} value={t}>
                    <Chip size="small" label={t} sx={{ mr: 1 }} /> {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ textAlign: { xs: "right", sm: "left" }, gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <Button size="small" onClick={handleReset}>Reset</Button>
          </Box>
        </Paper>

        {/* Top pagination 
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
        />
        </Box>
            */}

        {/* Empty state */}
        {pagePosts.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              No posts found. Adjust your search or filters.
            </Typography>
            <Button size="small" onClick={handleReset}>Clear filters</Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {pagePosts.map((post) => {
              const isOpen = expanded === post.key;
              const authorName = post.author || defaultAuthorName;
              const author = authorName ? authorsByName.get(authorName) : null;

              return (
                <Paper
                  key={post.key}
                  id={post.key}
                  variant="outlined"
                  sx={{ p: { xs: 2, sm: 3 }, scrollMarginTop: "var(--top-offset, 72px)" }}
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {post.title}
                    </Typography>

                    {/* Author + meta row */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                      {!!author && (
                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mr: 0.5 }}>
                          <Avatar
                            src={author.photo}
                            alt={author.name}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {author.name}
                          </Typography>
                        </Stack>
                      )}
                      <Divider
                        flexItem
                        orientation="vertical"
                        sx={{ mx: 0.5, display: { xs: "none", sm: "block" } }}
                      />
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatDate(post.date)}
                      </Typography>
                      <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                      <Stack direction="row" spacing={0.5}>
                        {post.tags?.map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>

                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                      {post.excerpt}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {isOpen ? (
                      <>
                        <Box sx={{ "& *:first-of-type": { mt: 0 } }}>
                          <ReactMarkdown components={mdComponents}>
                            {post.contentMd}
                          </ReactMarkdown>
                        </Box>
                        <Button
                          size="small"
                          onClick={closePost}
                          sx={{ mt: 0.5 }}
                          aria-expanded="true"
                          aria-controls={`${post.key}-content`}
                        >
                          Show less
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => openPost(post.key)}
                        sx={{ mt: 0.5 }}
                        aria-expanded="false"
                        aria-controls={`${post.key}-content`}
                      >
                        Read more
                      </Button>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}

        {/* Bottom pagination */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
}
