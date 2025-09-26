import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import EditView from "../views/EditView.jsx";

export default function HeroComponent({ title, subtitle, edit = false }) {
  const content = (
    <Paper
      sx={{
        px: { xs: 2, sm: 3 },
        py: 4,
        borderRadius: 0,
        width: "100%",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
  return <EditView edit={edit}>{content}</EditView>;
}
