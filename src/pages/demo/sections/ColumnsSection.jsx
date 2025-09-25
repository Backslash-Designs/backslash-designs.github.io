import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

// Fallback minimal renderer if no renderSection prop is provided
import HeroSection from "./HeroSection.jsx";
import TextSection from "./TextSection.jsx";
import ListSection from "./ListSection.jsx";

function DefaultRenderer({ section }) {
    const { type, props = {} } = section || {};
    switch (type) {
        case "hero":
            return <HeroSection {...props} />;
        case "text":
            return <TextSection {...props} />;
        case "list":
            return <ListSection {...props} />;
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
}) {
    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n || 0));
    const requested = Number.isFinite(Number(cols)) && Number(cols) > 0 ? Number(cols) : (Array.isArray(columns) ? columns.length : 0);
    const colCount = clamp(requested || 3, minCols, maxCols);

    // Ensure we have exactly colCount arrays
    const colsData = Array.from({ length: colCount }, (_, i) => (Array.isArray(columns[i]) ? columns[i] : []));

    const smCols = Math.min(2, colCount); // at most 2 on small screens

    const render =
        renderSection ||
        ((sub) => (
            <DefaultRenderer section={sub} />
        ));

    const renderItem = (sub, i) =>
        withCards ? (
            <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                {render(sub)}
            </Paper>
        ) : (
            <Box key={i}>{render(sub)}</Box>
        );

    return (
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
                {colsData.map((col, idx) => (
                    <Stack key={idx} spacing={itemSpacing} sx={{ width: '100%' }}>
                        {col.map((sub, i) => (
                            <Box key={i} sx={{ width: '100%' }}>{renderItem(sub, i)}</Box>
                        ))}
                    </Stack>
                ))}
            </Box>
        </Box>
    );
}
