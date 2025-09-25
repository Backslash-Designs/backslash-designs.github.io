import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditView from "../views/EditView.jsx";

export default function ListSection({ title, items = [], edit = false  }) {
  const content = (
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
  return <EditView edit={!!edit}>{content}</EditView>;
}
