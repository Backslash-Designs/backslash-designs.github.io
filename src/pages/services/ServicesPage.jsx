import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useLocation } from "react-router-dom"; // + add

// Shared data source for both Home and Detailed views
export const SERVICES = [
  {
    key: "web",
    title: "Web Development",
    summary: "Modern, lightweight sites and apps—this site is an example.",
    details:
      "React + Vite + MUI builds with clean components, accessible UI, and simple deploys to static hosting/CDN.",
    bullets: [
      "React, Vite, and MUI implementation",
      "SEO basics, analytics, and sitemaps",
      "CI/CD and preview deploys",
      "Straightforward content updates",
    ],
    Icon: DesignServicesIcon,
    contactHref: "/contact?service=web",
  },
  {
    key: "identity",
    title: "Identity & SaaS Management",
    summary: "Tenant management, SSO integrations, and password management you can trust.",
    details:
      "Hands-on with Microsoft 365 and Google Workspace, integrating SAML/OAuth apps (Adobe, Canva, Amazon Business) and rolling out 1Password.",
    bullets: [
      "M365/Google Workspace tenant and policy management",
      "SSO integrations for Adobe, Canva, Amazon Business",
      "1Password provisioning, groups, and vault policies",
      "User lifecycle and periodic access reviews",
    ],
    Icon: SecurityIcon,
    contactHref: "/contact?service=identity",
  },
  {
    key: "clinical",
    title: "Clinical Systems Implementation",
    summary: "Clinical charting setup and operations centered on Jane App.",
    details:
      "Implementations tailored to workflows, permissions, templates, and integrations to keep practices running smoothly.",
    bullets: [
      "Jane App setup, roles, and permissions",
      "Clinical templates and intake forms",
      "Calendar, payments, and email integrations",
      "Training and change management",
    ],
    Icon: VerifiedIcon,
    contactHref: "/contact?service=clinical",
  },
  {
    key: "hosting",
    title: "Managed Containerized Services",
    summary: "Deploy and keep small containerized services running reliably (e.g., Mealie).",
    details:
      "Dockerized services behind a secure reverse proxy with automatic TLS, updates, monitoring, and backups.",
    bullets: [
      "Docker Compose deployments and maintenance",
      "Reverse proxy and HTTPS/TLS setup",
      "Automated backups and restore testing",
      "Health checks and upgrade workflows",
    ],
    Icon: QueryStatsIcon,
    contactHref: "/contact?service=hosting",
  },
  {
    key: "networking",
    title: "Networking, Cameras, and Cabling",
    summary: "Copper runs, PoE, and camera systems (Ubiquiti) done cleanly and tested.",
    details:
      "From planning and pulling CAT5/6 to terminating, labeling, testing, and bringing PoE devices and NVR/DVR online.",
    bullets: [
      "CAT5/6 planning, pulling, termination, testing",
      "PoE switches and patch management",
      "Ubiquiti security camera and NVR/DVR setup",
      "Basic VLANs and Wi‑Fi planning",
    ],
    Icon: VerifiedIcon,
    contactHref: "/contact?service=networking",
  },
  {
    key: "pro-av",
    title: "Pro A/V & Live Broadcast",
    summary: "Planning and delivering live production—NDI/SDI pipelines, switching, and reliable streaming.",
    details:
      "End‑to‑end project work: signal‑flow design, equipment selection, staging, and show‑day operation with documented runbooks.",
    bullets: [
      "NDI/SDI video workflows and routing",
      "Audio integration (Dante, mixers) and sync",
      "Switchers, capture, graphics, and multiview",
      "Streaming, recording, redundancy, and comms",
    ],
    Icon: VideocamIcon,
    contactHref: "/contact?service=pro-av",
  },
  {
    key: "support",
    title: "Endpoint Management & Support",
    summary: "Remote/on‑site support plus endpoint backup.",
    details:
      "Datto RMM and RustDesk for remote access; Autotask for tickets and SLAs; proactive maintenance for dependable devices.",
    bullets: [
      "Remote endpoint management (Datto RMM, RustDesk)",
      "Remote & on‑site support (Autotask)",
      "Endpoint backup configuration and checks",
      "Patch and update management",
    ],
    Icon: SupportAgentIcon,
    contactHref: "/contact?service=support",
  },
];

/* Home: summary grid (keeps existing layout/behavior) */
export default function Services() {
  return (
    <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Services
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          {SERVICES.map(({ key, title, summary, Icon, contactHref }) => (
            <Grid key={key} item size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
                <Stack spacing={1.25}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                      <Icon fontSize="small" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {summary}
                  </Typography>
                  <Box>
                    {/* Keeps current behavior linking to Contact */}
                    <Button size="small" component="a" href={contactHref}>
                      Learn more
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

/* Detailed page: expanded sections for each service */
export function ServicesPage() {
  const location = useLocation(); // + add

  React.useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]); // + add

  return (
    <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Services
        </Typography>

        <Stack spacing={2}>
          {SERVICES.map(({ key, title, summary, details, bullets = [], testimonial, Icon, contactHref }) => (
            <Paper
              key={key}
              variant="outlined"
              id={key}
              sx={{
                p: { xs: 2, sm: 3 },
                scrollMarginTop: "var(--top-offset, 72px)", // make room for sticky header
              }}
            >
              <Stack spacing={1.25}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: (t) => t.palette.action.hover,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {title}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ opacity: 0.95 }}>
                  {summary}
                </Typography>
                {details && (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {details}
                  </Typography>
                )}

                {!!bullets.length && (
                  <Box component="ul" sx={{ m: 0, pl: 3, opacity: 0.95 }}>
                    {bullets.map((b) => (
                      <li key={b}>
                        <Typography variant="body2">{b}</Typography>
                      </li>
                    ))}
                  </Box>
                )}

                {testimonial?.quote && (
                  <Box
                    component="blockquote"
                    cite={testimonial.author}
                    sx={{
                      m: 0,
                      mt: 1,
                      p: 2,
                      borderLeft: (t) => `3px solid ${t.palette.divider}`,
                      bgcolor: (t) => t.palette.action.hover,
                      fontStyle: "italic",
                    }}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      “{testimonial.quote}”
                    </Typography>
                    {testimonial.author && (
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        — {testimonial.author}
                      </Typography>
                    )}
                  </Box>
                )}

                <Box sx={{ pt: 0.5 }}>
                  <Button variant="contained" size="small" component="a" href={contactHref}>
                    Get in touch
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
