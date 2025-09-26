import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { RenderSection } from "./DynamicPage.jsx";
import { ensurePage } from "./pageRegistry.js";
import { useLocation } from "react-router-dom"; // + add

export default function MultiDynamicPage({ path, name, fallback }) {
  const data = ensurePage({ path, name });

  React.useEffect(() => {
    if (data?.name) document.title = data.name;
  }, [data?.name]);

  // + hash scrolling
  const location = useLocation();
  React.useEffect(() => {
    const id = location.hash?.slice(1);
    if (!id) return;
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scroll();
    const t = setTimeout(scroll, 50);
    return () => clearTimeout(t);
  }, [location.hash]);

  if (!data) {
    return (
      fallback || (
        <Paper variant="outlined" sx={{ p: 3, my: 4 }}>
          <Typography variant="h6">Page not found</Typography>
          <Typography variant="body2">
            No page matched path="{path}" name="{name}"
          </Typography>
        </Paper>
      )
    );
  }

  return (
    <Box component="section" sx={{ width: "100%", boxSizing: "border-box" }}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{ width: "100%", boxSizing: "border-box", px: 0 }}
      >
        {(data.sections || []).map((section, i) => {
          const fullBleed =
            section.type === "hero" && (section.props?.fullBleed ?? true);
          if (fullBleed) return <RenderSection key={i} section={section} />;
          return (
            <Box
              key={i}
              sx={{
                width: "100%",
                boxSizing: "border-box",
                px: { xs: 2, sm: 3 },
                py: 2
              }}
            >
              <RenderSection section={section} />
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}
