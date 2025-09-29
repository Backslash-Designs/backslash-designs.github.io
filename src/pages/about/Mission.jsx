import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Mission() {
  return (
    <Box component="section" id="mission" sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Our Mission
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.95, mb: 1.25 }}>
        Backslash Designs helps small businesses without dedicated IT teams modernize with confidence. We guide organizations from ad‑hoc tools to scalable, secure, and reliable operations.
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.95 }}>
        Whether you’re building an internal IT function or choosing ongoing managed services (MSP), we meet you where you are, simplify complexity, and establish sustainable foundations that grow with your business.
      </Typography>
    </Box>
  );
}
