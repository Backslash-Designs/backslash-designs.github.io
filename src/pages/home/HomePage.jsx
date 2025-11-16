import React from "react";
import Hero from "./Hero.jsx";
import { ValuesSummary } from "../about/Values.jsx";
import ServicesSummary  from "../services/ServicesPage.jsx";
import { SectorsSummary } from "../sectors/SectorsPage.jsx";
import SEO from "../../components/SEO.jsx";

import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box sx={{ width: "100%", justifySelf: "stretch", alignSelf: "stretch" }}>
      <SEO
        title="Backslash Designs | Scalable, Reliable, Secure IT & Media Services"
        description="Backslash Designs provides scalable, reliable, and secure IT, media, and support services for organizations across broadcast, mental health, and non-profit sectors."
        canonical="https://www.backslashdesigns.ca/"
        isHome
      />
      <Hero />
      <SectorsSummary bgStyle="particles" />
      <ServicesSummary bgStyle="paper" />
      <ValuesSummary bgStyle="particles" />
    </Box>
  );
}