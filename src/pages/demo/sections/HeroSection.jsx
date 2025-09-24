import React from "react";
import Box from "@mui/material/Box"; // + add
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function HeroSection({ title, subtitle, fullBleed = true }) {
  return (
    <Box
      sx={
        fullBleed
          ? {
              width: "100vw",
              maxWidth: "100vw",
              ml: "calc(50% - 50vw)",
              mr: "calc(50% - 50vw)",
            }
          : undefined
      }
    >
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
