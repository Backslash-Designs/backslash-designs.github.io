import React from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import { mdComponents, formatDate } from "../../services/BlogContentService";

/**
 * BlogArticleDialog
 * Props:
 *   open: boolean
 *   post: { key, title, date, tags, contentMd, excerpt, author }
 *   author: { name, photo }
 *   onClose: () => void
 */
export default function BlogArticleDialog({ open, post, author, onClose }) {
  const navigate = useNavigate();
  const descriptionId = post ? `${post.key}-content` : undefined;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="blog-article-title"
      aria-describedby={descriptionId}
      scroll="paper"
    >
      {post && (
        <>
          <DialogTitle id="blog-article-title" sx={{ pr: 6 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
              {post.title}
            </Typography>
            <IconButton
              aria-label="Close article"
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers id={descriptionId}>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                {author && (
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
                      {post.tags.map((t) => (
                        <Chip key={t} label={t} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </>
                ) : null}
              </Stack>
            </Stack>
            <Box sx={{ "& *:first-of-type": { mt: 0 } }}>
              <ReactMarkdown components={mdComponents}>{post.contentMd}</ReactMarkdown>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 1.5 }}>
            {post && (
              <Button
                size="small"
                onClick={() => {
                  // open full page keeping hashless url
                  navigate(`/blog/article/${post.key}`);
                }}
              >
                Fullscreen
              </Button>
            )}
            <Button onClick={onClose} size="small">Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
