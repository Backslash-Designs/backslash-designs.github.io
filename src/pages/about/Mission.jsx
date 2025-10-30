import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Card } from "@mui/material";

export default function Mission() {
  return (
    <Paper
      component="section"
      id="mission"
      square
      elevation={0}
      sx={{
        position: "relative",
        left: "50%",
        right: "50%",
        ml: "-50vw",
        mr: "-50vw",
        width: "100vw",
        // Ensure no dark-mode overlay so this matches the AppBar color
        backgroundImage: "none",
        bgcolor: "secondary.main",
        py: 4,
        mb: 4,
      }}
    >
        <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            About Our Mission
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1.25 }}>
            Backslash Designs helps small businesses without dedicated IT teams modernize with confidence. We guide organizations from ad‑hoc tools to scalable, secure, and reliable operations.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Whether you’re building an internal IT function or choosing ongoing managed services (MSP), we meet you where you are, simplify complexity, and establish sustainable foundations that grow with your business.
          </Typography>
        </Box>
        </Box>
    </Paper>
  );
}
