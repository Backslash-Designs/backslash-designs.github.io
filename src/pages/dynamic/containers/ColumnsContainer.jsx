import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EditView from "../views/EditView.jsx";

// Fallback minimal renderer if no renderSection prop is provided
import HeroComponent from "../components/HeroComponent.jsx";
import TextComponent from "../components/TextComponent.jsx";
import ListComponent from "../components/ListComponent.jsx";
import ButtonComponent from "../components/ButtonComponent.jsx";
import CardComponent from "../components/CardComponent.jsx";
import SectionContainer from "./SectionContainer.jsx";

function DefaultRenderer({ section }) {
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
 * - columns: Section[][]
 * - cols?: number
 * - minCols?: number
 * - maxCols?: number
 * - gap?: number
 * - itemSpacing?: number
 * - withCards?: boolean
 * - renderSection?: (section) => ReactNode
 */
export default function ColumnsContainer({
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
  const requested =
    Number.isFinite(Number(cols)) && Number(cols) > 0
      ? Number(cols)
      : Array.isArray(columns)
      ? columns.length
      : 0;
  const colCount = clamp(requested || 3, minCols, maxCols);
  const colsData = Array.from({ length: colCount }, (_, i) =>
    Array.isArray(columns[i]) ? columns[i] : []
  );
  const smCols = Math.min(2, colCount);

  const render =
    renderSection ||
    ((sub) => {
      if (
        sub &&
        typeof sub === "object" &&
        sub.type &&
        ["hero", "text", "list", "button", "card", "section"].includes(sub.type)
      ) {
        return <DefaultRenderer section={{ ...sub, props: { ...sub.props, edit } }} />;
      }
      return <DefaultRenderer section={sub} />;
    });

  const renderItem = (sub, i) => (
    <Box key={i} sx={{ width: "100%" }}>
      {render(sub)}
    </Box>
  );

  return (
    <EditView edit={edit}>
      <Box sx={{ width: "100%", boxSizing: "border-box" }}>
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
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {colsData.map((col, idx) => {
            const content = (
              <Stack spacing={itemSpacing} sx={{ width: "100%" }}>
                {col.map(renderItem)}
              </Stack>
            );
            return withCards ? (
              <Paper key={idx} variant="outlined" sx={{ p: 2, width: "100%", boxSizing: "border-box" }}>
                {content}
              </Paper>
            ) : (
              <Box key={idx} sx={{ width: "100%" }}>
                {content}
              </Box>
            );
          })}
        </Box>
      </Box>
    </EditView>
  );
}
