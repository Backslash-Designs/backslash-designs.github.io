// BlogContentService: shared blog content helpers & MUI markdown mappings
// This centralizes logic so multiple pages (blog, landing highlights, etc.) can reuse
// the same transformations and component mappings.

import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import BLOG_DB from "../pages/blog/blogs.json"; // build-time fallback JSON (bundled)

// Map DB/blog JSON record into normalized post POJO consumed by UI layers
export const mapDbToPosts = (db) =>
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

// Used when remote runtime index returns an array of raw post-like objects
export const mapRawEntriesToPosts = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.map((p, i) => ({
    key: p.slug || p.file || `post-${i}`,
    title: p.title || p.aliases || p.slug || `post-${i}`,
    date: p.posted_date || p.created_date || p.date || null,
    excerpt: p.summary || "",
    contentMd: p.body || "",
    author: Array.isArray(p.author) ? (p.author[0] || "") : (p.author || ""),
    tags: Array.isArray(p.tags) ? p.tags : [],
    values: Array.isArray(p.values) ? p.values : [],
    vendors: Array.isArray(p.vendors) ? p.vendors : [],
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    other: Array.isArray(p.other) ? p.other : Array.isArray(p.others) ? p.others : [],
  }));
};

// Build-time fallback exposed for consumers
export const POSTS_FALLBACK = mapDbToPosts(BLOG_DB);

// Shared MUI component overrides for react-markdown
export const mdComponents = {
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

export function formatDate(iso) {
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

// Utility to normalize plain-text search from markdown
export const mdToPlain = (md = "") =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalize = (s) => (s || "").toString().toLowerCase().trim();
