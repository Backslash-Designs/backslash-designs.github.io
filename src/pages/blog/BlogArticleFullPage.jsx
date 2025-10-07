import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ReactMarkdown from "react-markdown";
import { useBlogsIndex } from "../../services/BlogsIndexService";
import { POSTS_FALLBACK, mdComponents, mapRawEntriesToPosts, formatDate } from "../../services/BlogContentService";
import { TEAM } from "../about/Team.jsx";

// Fullscreen single article view.
// Route: /blog/article/:key  (using post.key)
export default function BlogArticleFullPage() {
  const { key } = useParams();
  const navigate = useNavigate();

  const { loading, error, entries, reload } = useBlogsIndex();
  const posts = React.useMemo(() => {
    if (entries && entries.length) {
      const first = entries[0];
      if (first && (first.title || first.slug || first.body)) {
        return mapRawEntriesToPosts(entries);
      }
    }
    return POSTS_FALLBACK;
  }, [entries]);

  const post = React.useMemo(() => posts.find(p => p.key === key), [posts, key]);
  const authorsByName = React.useMemo(() => {
    const map = new Map();
    TEAM.forEach(m => map.set(m.name, m));
    return map;
  }, []);
  const authorName = post?.author || TEAM[0]?.name;
  const author = authorName ? authorsByName.get(authorName) : null;

  React.useEffect(() => {
    if (!loading && !post) {
      // If no post after loading, redirect back to blog list preserving filters if any in referrer search
      navigate("/blog", { replace: true });
    }
  }, [loading, post, navigate]);

  return (
    <Box component="main" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Button size="small" onClick={() => navigate(-1)} sx={{ mb: 2 }}>&larr; Back</Button>
        {loading && (
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>Loading article…</Typography>
          </Paper>
        )}
        {error && (
          <Paper variant="outlined" color="error" sx={{ p: 2, textAlign: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Could not load latest content (using fallback). {error.message}
            </Typography>
            <Button size="small" onClick={() => reload()}>Retry</Button>
          </Paper>
        )}
        {post && (
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {post.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                {!!author && (
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mr: 0.5 }}>
                    <Avatar src={author.photo} alt={author.name} sx={{ width: 28, height: 28 }} />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {author.name}
                    </Typography>
                  </Stack>
                )}
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, display: { xs: "none", sm: "block" } }} />
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {formatDate(post.date)}
                </Typography>
                {post.tags?.length ? (
                  <>
                    <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                      {post.tags.map(t => <Chip key={t} label={t} size="small" variant="outlined" />)}
                    </Stack>
                  </>
                ) : null}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ "& *:first-of-type": { mt: 0 } }}>
                <ReactMarkdown components={mdComponents}>{post.contentMd}</ReactMarkdown>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
