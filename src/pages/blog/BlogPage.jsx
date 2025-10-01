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
    const [expanded, setExpanded] = React.useState(null);

    React.useEffect(() => {
        const hashKey = location.hash?.slice(1) || null;
        setExpanded(hashKey);
        if (hashKey) {
        // Smooth scroll to targeted post
        requestAnimationFrame(() => {
            document.getElementById(hashKey)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        }
    }, [location.hash]);

    const openPost = (key) => {
        setExpanded(key);
        navigate(`/blog#${key}`, { replace: false });
    };

    const closePost = () => {
        setExpanded(null);
        navigate(`/blog`, { replace: false });
    };

    return (
        <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Blog
            </Typography>
            <Stack spacing={2}>
            {POSTS.map((post) => {
                const isOpen = expanded === post.key;
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
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
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
        </Box>
        </Box>
    );
}
