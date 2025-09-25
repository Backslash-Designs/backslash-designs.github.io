import React from "react";
import Typography from "@mui/material/Typography";

export default function TextSection({ body }) {
  return (
    <Typography variant="body1" sx={{ opacity: 0.95, width: '100%', boxSizing: 'border-box' }}>
      {body}
    </Typography>
  );
}
