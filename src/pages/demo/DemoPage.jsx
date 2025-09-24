import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import pageData from "./demo.page.json";
import HeroSection from "./sections/HeroSection.jsx";
import TextSection from "./sections/TextSection.jsx";
import ListSection from "./sections/ListSection.jsx";
import { Container } from "@mui/material";
import Columns3Section from "./sections/Columns3Section.jsx"; // new

// Tiny, placeholder renderer. Expand with real generic components later.
function RenderSection({ section }) {
    const { type, props = {} } = section || {};
    switch (type) {
        case "hero":
            return <HeroSection {...props} />;

        case "text":
            return <TextSection {...props} />;

        case "list":
            return <ListSection {...props} />;

        // NEW: delegate to Columns3Section component
        case "columns3":
            return (
                <Columns3Section
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

export default function DemoPage() {
    React.useEffect(() => {
        if (pageData?.name) document.title = pageData.name;
    }, []);

    return (
        <Box component="section">
        <Container className="DemoPage" maxWidth={false} disableGutters>
            {(pageData.sections || []).map((section, i) => {
                const fullBleed = section.type === "hero" && (section.props?.fullBleed ?? true);
                if (fullBleed) {
                    return <RenderSection key={i} section={section} />;
                }
                return (
                    <Box key={i} sx={{ maxWidth: 1100, mx: "auto", width: "100%", px: { xs: 2, sm: 3 }, py: 2 }}>
                        <RenderSection section={section} />
                    </Box>
                );
            })}
        </Container>
        </Box>
    );
}