import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>404 — Page Not Found</Typography>
      <Typography sx={{ opacity: 0.8, mb: 2 }}>
        Sorry, the page you’re looking for doesn’t exist.
      </Typography>
      <Typography component={Link} to="/" sx={{ textDecoration: "none" }}>
        Go back home
      </Typography>
    </Box>
  );
}
