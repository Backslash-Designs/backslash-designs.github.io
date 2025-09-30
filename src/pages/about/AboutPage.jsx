import React from "react";
import Box from "@mui/material/Box";
import ValuesPage from "./Values.jsx";
import Team from "./Team.jsx"; 
import Mission from "./Mission.jsx"; 

// New, concise summaries for the About page only
const aboutSummaries = {
  scalable: "Designed to scale horizontally with clean boundaries, async workloads, and cost-aware automation.",
  reliable: "Built for steady uptime—clear SLOs, safe deploys, and fast, observable recovery.",
  secure: "Security by default: least-privilege access, strong encryption, and continuous hardening.",
};

export default function About() {
  return (
    <Box component="section" sx={{ px: { xs: 2, sm: 3 }, pt: 0, pb: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Mission section */}
        <Mission />
        <ValuesPage summariesById={aboutSummaries} />
        {/* Team section */}
        <Team />
      </Box>
    </Box>
  );
}