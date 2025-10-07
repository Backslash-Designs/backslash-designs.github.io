import React from "react";
import Hero from "./Hero.jsx";
import { ValuesSummary } from "../about/Values.jsx";
import ServicesSummary  from "../services/ServicesPage.jsx";
import { SectorsSummary } from "../sectors/SectorsPage.jsx";

import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box sx={{ width: "100%", justifySelf: "stretch", alignSelf: "stretch" }}>
      <Hero />
      <SectorsSummary bgStyle="none" />
      <ServicesSummary bgStyle="paper" />
      <ValuesSummary bgStyle="none" />
    </Box>
  );
}