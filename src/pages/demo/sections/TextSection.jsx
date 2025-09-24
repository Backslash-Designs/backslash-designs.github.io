import React from "react";
import Typography from "@mui/material/Typography";

export default function TextSection({ body }) {
  return (
    <Typography variant="body1" sx={{ opacity: 0.95 }}>
      {body}
    </Typography>
  );
}
