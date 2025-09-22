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
import { useLocation } from "react-router-dom"; // + add

// Shared data source for both Home and Detailed views
export const SERVICES = [
  {
    key: "web",
    title: "Web & App Development",
    summary: "Modern, performant React frontends and robust backends built for growth.",
    details:
      "We deliver responsive, accessible UIs and resilient APIs. Our stacks emphasize DX, testing, and CI/CD so features ship faster with confidence.",
    bullets: [
      "React, Vite, and MUI for performant, accessible UIs",
      "CI/CD, preview deploys, and automated testing",
      "TypeScript-first, API contracts, and docs",
      "Edge-ready and cloud-native architectures",
    ],
    Icon: DesignServicesIcon,
    contactHref: "/contact?service=web",
  },
  {
    key: "security",
    title: "Security Hardening",
    summary: "Threat modeling, hardening, and policies to keep systems resilient.",
    details:
      "We take a defense-in-depth approach—least privilege, encryption, secrets management, and continuous hardening across environments.",
    bullets: [
      "Threat modeling and secure-by-default patterns",
      "Secrets management and key rotation",
      "Hardening guides, reviews, and policy templates",
      "Security headers, SSO, and 2FA enablement",
    ],
    Icon: SecurityIcon,
    contactHref: "/contact?service=security",
  },
  {
    key: "automation",
    title: "Automation & Integrations",
    summary: "Connect tools and streamline workflows with reliable automation.",
    details:
      "Reduce toil with reliable automations that connect your SaaS, data, and deployments. We design observability into every integration.",
    bullets: [
      "Event-driven workflows, webhooks, and queues",
      "SaaS integrations (GitHub, Slack, Stripe, etc.)",
      "Runbooks and failure-safe fallbacks",
      "Telemetry and alerting built-in",
    ],
    Icon: QueryStatsIcon,
    contactHref: "/contact?service=automation",
  },
  {
    key: "qa",
    title: "Quality & Compliance",
    summary: "Testing pipelines, observability, and compliance-friendly practices.",
    details:
      "Level up delivery quality with layered testing, linting, and traceability. We align processes to support audits and compliance standards.",
    bullets: [
      "Unit, integration, and E2E pipelines",
      "Coverage, linting, and type safety",
      "Release notes and change management",
      "Dashboards for uptime and SLOs",
    ],
    Icon: VerifiedIcon,
    contactHref: "/contact?service=qa",
  },
  {
    key: "support",
    title: "Ongoing Support",
    summary: "Proactive maintenance and responsive help when you need it.",
    details:
      "Stay focused on your roadmap while we handle updates, patches, and reliable support with clear SLAs.",
    bullets: [
      "Transparent SLAs and ticket triage",
      "Proactive patching and dependency care",
      "Monitoring and incident response",
      "Knowledge base and handover docs",
    ],
    Icon: SupportAgentIcon,
    contactHref: "/contact?service=support",
    testimonial: {
      quote:
        "Backslash kept our stack fast and secure while we scaled—issues were resolved before customers noticed.",
      author: "Ops Lead, SaaS Company",
    },
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
