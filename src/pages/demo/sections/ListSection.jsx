import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ListSection({ title, items = [] }) {
  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
      )}
      <Box component="ul" sx={{ m: 0, pl: 3 }}>
        {items.map((item, idx) => (
          <li key={idx}>
            <Typography variant="body2">{item}</Typography>
          </li>
        ))}
      </Box>
    </Box>
  );
}
