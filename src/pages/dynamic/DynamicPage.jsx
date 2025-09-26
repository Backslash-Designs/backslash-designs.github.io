import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import pageData from "./dynamic.page.json";
import { Container } from "@mui/material";
import HeroComponent from "./components/HeroComponent.jsx";
import TextComponent from "./components/TextComponent.jsx";
import ListComponent from "./components/ListComponent.jsx";
import ButtonComponent from "./components/ButtonComponent.jsx";
import SectionContainer from "./containers/SectionContainer.jsx";
import ColumnsContainer from "./containers/ColumnsContainer.jsx";
import { useLocation } from "react-router-dom";

export function RenderSection({ section }) {
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

export default function DynamicPage({ data }) {
  const activeData = data || pageData;

  React.useEffect(() => {
    if (activeData?.name) document.title = activeData.name;
  }, [activeData?.name]);

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

  return (
    <Box component="section" sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Container className="DemoPage" maxWidth={false} disableGutters sx={{ width: '100%', boxSizing: 'border-box', px: 0 }}>
        {(activeData.sections || []).map((section, i) => {
          const fullBleed = section.type === "hero" && (section.props?.fullBleed ?? true);
          if (fullBleed) {
            return <RenderSection key={i} section={section} />;
          }
          return (
            <Box key={i} sx={{ width: '100%', boxSizing: 'border-box', px: { xs: 2, sm: 3 }, py: 2 }}>
              <RenderSection section={section} />
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}