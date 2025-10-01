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

export const POSTS = [
    {
        key: "hello-world",
        title: "Hello, world — introducing our new site",
        date: "2025-09-25",
        tags: ["Announcement", "Site"],
        excerpt:
        "We’ve launched a new site built with React, Vite, and MUI — fast, accessible, and easy to maintain.",
        contentMd: `
This site is designed around a simple, scalable architecture: **React + Vite + MUI**, deployed to static hosting. It keeps content maintainable and performance excellent, while fitting our priorities of scalability, reliability, and security.

Expect lightweight pages, clear navigation, and sections tailored to services and sectors we support. Feedback is welcome!

\`\`\`bash
# dev
npm run dev

# build & preview
npm run build && npm run preview
\`\`\`
`,
    },
    {
        key: "values-in-practice",
        title: "Our values in practice",
        date: "2025-09-28",
        tags: ["Scalable", "Reliable", "Secure"],
        excerpt:
        "A quick look at how we apply our core values on real projects — from delivery to operations.",
        contentMd: `
We prioritize clean boundaries, observability, and security-by-default. That translates to predictable change management, measurable SLAs, and practical hardening across the stack.

- Containerized services with backups
- Identity-managed access
- Monitored health checks and SLOs

Learn more on our [About](/about) page.
`,
},
    {
    key: "rustdesk-sos",
    title: "SOS Remote Agent — quick start",
    date: "2025-09-18",
    tags: ["Support", "Remote"],
    excerpt:
    "How to get started with the SOS remote agent we use for diagnostics and support.",
    contentMd: `
The SOS remote agent is our go-to tool for secure remote diagnostics.

1. Visit the [SOS](https://www.backslashdesigns.ca/sos) page and download the agent for your OS.
2. Run the agent and share the displayed code when prompted.
3. Keep the app open during the session.

> We only connect with your consent and terminate sessions when we're done.
`,
},
{
    key: "msp-intake-update",
    title: "Intake capacity update",
    date: "2025-09-21",
    tags: ["Announcement", "MSP"],
    excerpt:
    "A quick note on current capacity and how we handle the waitlist for new work.",
    contentMd: `
We're currently near capacity for new projects. If intake is paused, the **Contact** page offers a waitlist form.

- You'll get an email confirmation
- We'll reach out on a first-come basis
- You can opt-in for occasional updates

Thanks for your patience and interest.
`,
},
{
    key: "security-basics",
    title: "Security basics that matter",
    date: "2025-09-15",
    tags: ["Security", "Best Practices"],
    excerpt:
    "Foundational controls we enable on day one for small businesses.",
    contentMd: `
A few practical defaults:

- MFA for identities (admin + users)
- Password manager rollout and groups
- Least-privilege access with periodic reviews
- Patch hygiene and baseline hardening

Security is a posture, not a product.
`,
},
{
    key: "deploy-ci-cd",
    title: "CI/CD for small web projects",
    date: "2025-09-12",
    tags: ["CI/CD", "Web"],
    excerpt:
    "Fast static builds with Vite and simple preview deploys keep things moving.",
    contentMd: `
We keep pipelines simple:

- \`vite build\` for fast static output
- Preview deploys for pull requests
- Basic checks: lint, build, and smoke

This balances speed with confidence for most sites.
`,
},
{
    key: "networking-tips",
    title: "Clean networking and cameras",
    date: "2025-09-08",
    tags: ["Networking", "Cameras"],
    excerpt:
    "Notes from the field on small-site networking and PoE camera installs.",
    contentMd: `
Labeling, testing, and documentation are the wins:

- Terminate cleanly and test every run
- Document switch ports and PoE budgets
- Keep a simple VLAN plan and update maps
- Verify retention and time-sync on NVRs
`,
},
{
    key: "contact-updates",
    title: "Contact options and SLAs",
    date: "2025-09-04",
    tags: ["Support", "Process"],
    excerpt:
    "Where to open tickets and how we handle priority.",
    contentMd: `
For existing customers, use the ticket portal linked on the **Contact** page.

- Tickets are triaged by impact and urgency
- You'll receive updates via email
- Emergency issues should be flagged clearly

Response targets are documented per plan.
`,
},
    ];

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

    // NEW: derive initial filter state from URL
    const sp0 = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [query, setQuery] = React.useState(sp0.get("q") ?? "");
    const [selectedTags, setSelectedTags] = React.useState(
        (sp0.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
    const [sortBy, setSortBy] = React.useState(sp0.get("sort") || SORT_DEFAULT);

    const [page, setPage] = React.useState(1);
    const [expanded, setExpanded] = React.useState(null);

    // Keep local filters in sync with URL edits/back/forward
    React.useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const q = sp.get("q") ?? "";
        const tags = (sp.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
        const sort = sp.get("sort") || SORT_DEFAULT;
        if (q !== query) setQuery(q);
        // shallow compare tags
        if (tags.join(",") !== selectedTags.join(",")) setSelectedTags(tags);
        if (sort !== sortBy) setSortBy(sort);
    }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    // All unique tags (alpha)
    const allTags = React.useMemo(() => {
        const set = new Set();
        POSTS.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, []);

    // Author lookup
    const authorsByName = React.useMemo(() => {
        const map = new Map();
        TEAM.forEach((m) => map.set(m.name, m));
        return map;
    }, []);
    const defaultAuthorName = TEAM[0]?.name;

    // Filter + sort
    const filteredPosts = React.useMemo(() => {
        const q = normalize(query);
        const hasTags = selectedTags.length > 0;

        let list = POSTS.filter((p) => {
        // search
        const inTitle = normalize(p.title).includes(q);
        const inExcerpt = normalize(p.excerpt).includes(q);
        const inMd = normalize(mdToPlain(p.contentMd)).includes(q);
        const inTags = (p.tags || []).some((t) => normalize(t).includes(q));
        const inAuthor = normalize(p.author || defaultAuthorName || "").includes(q);
        const matchesSearch = !q || inTitle || inExcerpt || inMd || inTags || inAuthor;

        // tag filter (ANY-of)
        const matchesTags = !hasTags || (p.tags || []).some((t) => selectedTags.includes(t));

        return matchesSearch && matchesTags;
        });

        // sort
        switch (sortBy) {
        case "date-asc":
            list = list.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "title-asc":
            list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "title-desc":
            list = list.slice().sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "date-desc":
        default:
            list = list.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        }

        return list;
    }, [query, selectedTags, sortBy, defaultAuthorName]);

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

    // Helpers to push URL updates (preserve hash when appropriate)
    const pushFilters = React.useCallback(
        ({ q = query, tags = selectedTags, sort = sortBy, page = 1 }, { replace = true, keepHash = false } = {}) => {
        const sp = new URLSearchParams(location.search);
        if (q) sp.set("q", q); else sp.delete("q");
        if (tags?.length) sp.set("tags", tags.join(",")); else sp.delete("tags");
        if (sort && sort !== SORT_DEFAULT) sp.set("sort", sort); else sp.delete("sort");
        sp.set("page", String(page));
        const hash = keepHash && expanded ? `#${expanded}` : "";
        const url = `/blog?${sp.toString()}${hash}`;
        const curr = `${location.pathname}${location.search}${location.hash}`;
        if (url !== curr) navigate(url, { replace });
        },
        [location.search, location.pathname, expanded, navigate, query, selectedTags, sortBy]
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

    // NEW: filter/sort handlers
    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setExpanded(null);
        pushFilters({ q: val, tags: selectedTags, sort: sortBy, page: 1 }, { replace: true, keepHash: false });
    };
    const handleTagsChange = (e) => {
        const val = e.target.value; // array
        setSelectedTags(val);
        setExpanded(null);
        pushFilters({ q: query, tags: val, sort: sortBy, page: 1 }, { replace: false, keepHash: false });
    };
    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortBy(val);
        setExpanded(null);
        pushFilters({ q: query, tags: selectedTags, sort: val, page: 1 }, { replace: false, keepHash: false });
    };
    const handleReset = () => {
        setQuery("");
        setSelectedTags([]);
        setSortBy(SORT_DEFAULT);
        setExpanded(null);
        pushFilters({ q: "", tags: [], sort: SORT_DEFAULT, page: 1 }, { replace: false, keepHash: false });
    };

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pagePosts = filteredPosts.slice(start, end);

    return (
        <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Blog
            </Typography>

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
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 } }}>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select labelId="sort-label" value={sortBy} label="Sort by" onChange={handleSortChange}>
                <MenuItem value="date-desc">Newest</MenuItem>
                <MenuItem value="date-asc">Oldest</MenuItem>
                <MenuItem value="title-asc">Title A–Z</MenuItem>
                <MenuItem value="title-desc">Title Z–A</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ textAlign: { xs: "right", sm: "left" } }}>
                <Button size="small" onClick={handleReset}>Reset</Button>
            </Box>
            </Paper>

            {/* Top pagination */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
            />
            </Box>

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
