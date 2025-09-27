import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import HeroComponent from "./components/HeroComponent.jsx";
import TextComponent from "./components/TextComponent.jsx";
import ListComponent from "./components/ListComponent.jsx";
import ButtonComponent from "./components/ButtonComponent.jsx";
import CardComponent from "./components/CardComponent.jsx";
import SectionContainer from "./containers/SectionContainer.jsx";
import ColumnsContainer from "./containers/ColumnsContainer.jsx";
import { ensurePage, subscribe } from "../../services/DynamicPagesService.js";
import { useLocation } from "react-router-dom"; // + add

export default function MultiDynamicPage({ path, name, fallback }) {
  // Trigger re-render on registry updates
  const [ver, setVer] = React.useState(0);
  React.useEffect(() => {
    const unsub = subscribe(() => setVer((v) => v + 1));
    return unsub;
  }, []);

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

  // Move RenderSection inside component (no export)
  function RenderSection({ section }) {
    const { type, props = {} } = section || {};
    switch (type) {
      case "hero":
        return <HeroComponent {...props} />;
      case "text":
        return <TextComponent {...props} />;
      case "list":
        return <ListComponent {...props} />;
      case "button":
        return <ButtonComponent {...props} />;
      case "card":
        return <CardComponent {...props} />;
      case "section":
        return (
          <SectionContainer
            {...props}
            renderSection={(sub) => <RenderSection section={sub} />}
          />
        );
      case "columns":
        return (
          <ColumnsContainer
            {...props}
            renderSection={(sub) => <RenderSection section={sub} />}
          />
        );
      default:
        return (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Unknown section type: {String(type)}
            </Typography>
          </Paper>
        );
    }
  }

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
