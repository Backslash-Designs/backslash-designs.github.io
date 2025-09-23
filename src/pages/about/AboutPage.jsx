import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// Reuse the same array from the Home page
import { values } from "../home/Values.jsx";

// New, concise summaries for the About page only
const aboutSummaries = {
  scalable: "Designed to scale horizontally with clean boundaries, async workloads, and cost-aware automation.",
  reliable: "Built for steady uptime—clear SLOs, safe deploys, and fast, observable recovery.",
  secure: "Security by default: least-privilege access, strong encryption, and continuous hardening.",
};

export default function About() {
  return (
    <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          About our values
        </Typography>

        {values.map(({ title, details = [], Icon, href }) => {
          const id = (href && href.split("#")[1]) || title.toLowerCase().replace(/\s+/g, "-");
          const summary = aboutSummaries[id];
          return (
            <Box key={title} id={id} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: (t) => t.palette.action.hover,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
              </Box>

              {/* Use About-specific summary instead of reusing the Home description */}
              {summary && (
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.95 }}>
                  {summary}
                </Typography>
              )}

              <Stack spacing={0.75}>
                {Array.isArray(details) ? (
                  details.map((p, i) => (
                    <Typography key={i} variant="body2" sx={{ opacity: 0.95 }}>
                      {p}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    {details}
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
