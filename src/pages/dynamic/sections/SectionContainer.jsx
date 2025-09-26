import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import EditView from "../views/EditView.jsx";

/**
 * SectionContainer
 * Props:
 * - id?: string              // anchor id; if omitted, slug is derived from title
 * - title: string
 * - subtitle?: string
 * - sections?: Section[]     // nested sections to render
 * - withCard?: boolean       // wrap group in an outlined Paper
 * - edit?: boolean
 * - renderSection?: (section) => ReactNode  // supplied by renderer to render nested sections
 */
export default function SectionContainer({
  id,
  title,
  subtitle,
  sections = [],
  withCard = false,
  edit = false,
  renderSection,
}) {
  const slugify = (s) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_.]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

  const anchorId = id || slugify(title);

  const content = (
    <Box
      id={anchorId}
      sx={{
        // make room for sticky header when scrolled into view
        scrollMarginTop: "var(--top-offset, 72px)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ mb: 1.25 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Stack spacing={1.5}>
        {Array.isArray(sections) &&
          sections.map((s, i) =>
            renderSection ? (
              <Box key={i} sx={{ width: "100%" }}>
                {renderSection(s)}
              </Box>
            ) : (
              // Fallback: show raw type if no renderer is provided
              <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Unsupported nested section (no renderer attached).
                </Typography>
              </Paper>
            )
          )}
      </Stack>
    </Box>
  );

  return withCard ? (
    <EditView edit={edit}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, width: "100%" }}>
        {content}
      </Paper>
    </EditView>
  ) : (
    <EditView edit={edit}>{content}</EditView>
  );
}
