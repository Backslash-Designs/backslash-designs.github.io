import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EditView from "../views/EditView.jsx";

// Fallback minimal renderer if no renderSection prop is provided
import HeroSection from "./HeroSection.jsx";
import TextSection from "./TextSection.jsx";
import ListSection from "./ListSection.jsx";
import ButtonSection from "./ButtonSection.jsx";
import SectionContainer from "./SectionContainer.jsx"; // + add

function DefaultRenderer({ section }) {
    const { type, props = {} } = section || {};
    switch (type) {
        case "hero":
            return <HeroSection {...props} />;
        case "text":
            return <TextSection {...props} />;
        case "list":
            return <ListSection {...props} />;
        case "button":
            return <ButtonSection {...props} />;
        case "section": // + add
            return (
                <SectionContainer
                    {...props}
                    renderSection={(sub) => <DefaultRenderer section={sub} />}
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

/**
 * Props:
 * - title?: string
 * - columns: Section[][]     // arrays per column; length can be 2..n
 * - cols?: number            // explicitly request number of columns (2..n)
 * - minCols?: number         // clamp lower bound (default 2)
 * - maxCols?: number         // clamp upper bound (default 20)
 * - gap?: number             // MUI spacing for grid gap
 * - itemSpacing?: number     // spacing between items within a column
 * - withCards?: boolean      // wrap each nested section in Paper
 * - renderSection?: (section) => ReactNode // optional custom renderer
 */
export default function ColumnsSection({
    title,
    columns = [],
    cols,
    minCols = 2,
    maxCols = 20,
    gap = 2,
    itemSpacing = 1.25,
    withCards = false,
    renderSection,
    edit = false,
}) {
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n || 0));
    const requested = Number.isFinite(Number(cols)) && Number(cols) > 0 ? Number(cols) : (Array.isArray(columns) ? columns.length : 0);
    const colCount = clamp(requested || 3, minCols, maxCols);

    // Ensure we have exactly colCount arrays
    const colsData = Array.from({ length: colCount }, (_, i) => (Array.isArray(columns[i]) ? columns[i] : []));

    const smCols = Math.min(2, colCount); // at most 2 on small screens

    const render =
        renderSection ||
        ((sub) => {
            // Pass edit prop to nested sections if possible
            if (sub && typeof sub === 'object' && sub.type && ['hero','text','list','button','section'].includes(sub.type)) {
                return <DefaultRenderer section={{...sub, props: {...sub.props, edit}}} />;
            }
            return <DefaultRenderer section={sub} />;
        });

    // Removed per-item card wrapping; now only columns get wrapped when withCards is true
    const renderItem = (sub, i) => (
        <Box key={i} sx={{ width: '100%' }}>
            {render(sub)}
        </Box>
    );

    return (
        <EditView edit={edit}>
            <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
                {title && (
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                        {title}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "grid",
                        gap,
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: `repeat(${smCols}, 1fr)`,
                            md: `repeat(${colCount}, 1fr)`,
                        },
                        alignItems: "start",
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    {colsData.map((col, idx) => {
                        const content = (
                            <Stack spacing={itemSpacing} sx={{ width: '100%' }}>
                                {col.map(renderItem)}
                            </Stack>
                        );
                        return withCards ? (
                            <Paper
                                key={idx}
                                variant="outlined"
                                sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}
                            >
                                {content}
                            </Paper>
                        ) : (
                            <Box key={idx} sx={{ width: '100%' }}>
                                {content}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </EditView>
    );
}
