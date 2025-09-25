import React from "react";
import Typography from "@mui/material/Typography";
import EditView from "../views/EditView.jsx";
import Box from "@mui/material/Box";

export default function TextSection({ body, edit = false }) {
  const content = (
    <Typography variant="body1" sx={{ opacity: 0.95, width: '100%', boxSizing: 'border-box' }}>
      {body}
    </Typography>
  );
  return <EditView edit={edit}>{content}</EditView>;
}
