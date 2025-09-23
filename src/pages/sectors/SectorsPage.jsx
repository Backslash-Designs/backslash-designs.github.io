import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import Grid from "@mui/material/Grid";

export const SECTORS = [
  {
    key: "broadcast",
    title: "Live Broadcast & Pro A/V",
    Icon: VideocamIcon,
    short: "Live event production, streaming, and broadcast solutions.",
    href: "/sectors#broadcast",
    details: [
      "End-to-end support for live production, streaming, and event broadcasting.",
      "Expertise in NDI/SDI workflows, audio/video routing, and show-day operations.",
      "Solutions for redundancy, graphics, multiview, and reliable streaming.",
    ],
  },
  {
    key: "mental-health",
    title: "Mental Health & Clinical Practices",
    Icon: LocalHospitalIcon,
    short: "Clinical IT, charting, and secure workflows for practices.",
    href: "/sectors#mental-health",
    details: [
      "Implementation and support for clinical charting systems (Jane App).",
      "Workflow optimization, secure data handling, and compliance.",
      "Training, change management, and integrations for smooth operations.",
    ],
  },
  {
    key: "non-profit",
    title: "Non-Profit Organizations",
    Icon: VolunteerActivismIcon,
    short: "Affordable, mission-driven IT for non-profits and charities.",
    href: "/sectors#non-profit",
    details: [
      "IT solutions tailored for non-profits, including Microsoft 365 and Google Workspace.",
      "Cost-effective cloud, networking, and security services.",
      "Support for grant-funded projects and mission-driven technology needs.",
    ],
  },
];

// Main sectors details page
export default function SectorsPage() {
  return (
    <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Sectors We Support
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Backslash Designs specializes in providing IT solutions and managed services for organizations in Live Broadcast, Mental Health, and Non-Profit sectors. We understand the unique challenges and requirements of each field, delivering technology that adapts, performs, and protects.
        </Typography>
        <Stack spacing={3}>
          {SECTORS.map(({ key, title, Icon, details }) => (
            <Paper key={key} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: (t) => t.palette.action.hover,
                  }}
                >
                  <Icon fontSize="medium" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
              </Box>
              <Stack spacing={0.75} sx={{ pl: 0.5 }}>
                {details.map((d, i) => (
                  <Typography key={i} variant="body2" sx={{ opacity: 0.95 }}>
                    {d}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

// Sectors summary section for use on HomePage or elsewhere
// Sectors summary section for use on HomePage or elsewhere
export function SectorsSummary() {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", my: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Sectors We Serve
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {SECTORS.map(({ key, title, short, Icon, href }) => (
          <Grid item key={key} xs="auto">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: (t) => t.palette.action.hover,
                borderRadius: 2,
                px: 2,
                py: 1,
                minWidth: 220,
              }}
            >
              <Icon fontSize="small" />
              <Box>
                <Typography
                  variant="subtitle1"
                  component="a"
                  href={href}
                  sx={{
                    fontWeight: 600,
                    color: "inherit",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {short}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
