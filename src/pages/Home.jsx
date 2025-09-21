import React from "react";
import Hero from "../components/Hero.jsx";
import Values from "../components/Values.jsx";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";

export default function Home() {
  return (
    <Box sx={{ width: "100%", justifySelf: "stretch", alignSelf: "stretch" }}>
      <Hero />
      <Values />
    </Box>
  );
}
