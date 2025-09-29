import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import { SECTORS } from "../pages//sectors/SectorsPage.jsx";
import { SERVICES } from "../pages//services/ServicesPage.jsx";
import { useTheme } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";

export default function Footer() {
  const theme = useTheme();
  const logoSrc =
    theme.palette.mode === "dark"
      ? "/backslash-icon-dark.png"
      : "/backslash-icon-light.png";

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        pt: 3,
        pb: 2,
        px: { xs: 2, sm: 3 },
        bgcolor: (t) => t.palette.background.paper,
        borderTop: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* === GRID LAYOUT (order matches mockup numbers on mobile) === */}
        <Box
          sx={{
              display: "grid",
              gap: { xs: 3, md: 4 },
              gridTemplateAreas: {
                xs: `"contact"
                    "map_tb"
                    "map_kel"
                    "sitemap"
                    "sectors"
                    "services"`,
                md: `"contact sitemap sectors services"
                    "maps    sitemap sectors services"`,
              },
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(320px, 520px) repeat(3, minmax(180px, 1fr))",
              },
              alignItems: "start",
              mb: 2,
          }}
        >
          {/* 1. Contact / Brand */}
          <Box sx={{ gridArea: "contact" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                columnGap: 3,
                alignItems: "center",
              }}
            >
              <Box>
                <img
                  src={logoSrc}
                  alt="Backslash Designs"
                  style={{ width: 200, height: "auto", display: "block", maxWidth: "100%" }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 0.5,
                  }}
                >
                  <Box component="span" sx={{ fontStyle: "italic" }}>
                    Backslash
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontFamily:
                        '"Hack", ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontStyle: "italic",
                      fontWeight: 400,
                      ml: 0.5,
                    }}
                  >
                    Designs
                  </Box>
                </Typography>

                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  <Link href="mailto:business@backslashdesigns.ca" underline="hover">
                    business@backslashdesigns.ca
                  </Link>
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={2}>
                    <Link
                      href="https://x.com/backslash_dsgn"
                      target="_blank"
                      rel="noopener"
                      aria-label="X"
                      color="inherit"
                    >
                      <XIcon fontSize="medium" />
                    </Link>
                    <Link
                      href="https://www.instagram.com/backslashdesigns.ca"
                      target="_blank"
                      rel="noopener"
                      aria-label="Instagram"
                      color="inherit"
                    >
                      <InstagramIcon fontSize="medium" />
                    </Link>
                    <Link
                      href="https://linkedin.com/company/backslashdesigns"
                      target="_blank"
                      rel="noopener"
                      aria-label="LinkedIn"
                      color="inherit"
                    >
                      <LinkedInIcon fontSize="medium" />
                    </Link>
                    <Link
                      href="https://github.com/backslash-designs"
                      target="_blank"
                      rel="noopener"
                      aria-label="GitHub"
                      color="inherit"
                    >
                      <GitHubIcon fontSize="medium" />
                    </Link>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Wrapper area for maps on desktop */}
          <Box
            sx={{
              gridArea: { xs: "map_tb", md: "maps" },
              // On desktop this contains both maps; on mobile the second map is its own area (below)
            }}
          >
            {/* 2. Thunder Bay (always first map) + 3. Kelowna (conditionally here on md+) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              {/* Thunder Bay (2) */}
              <Box sx={{ gridArea: "auto" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Thunder Bay, ON
                </Typography>
                <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <iframe
                    title="Thunder Bay Map"
                    src="https://www.google.com/maps?q=Thunder+Bay,+ON&output=embed"
                    width="100%"
                    height="140"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Box>
              </Box>

              {/* Kelowna (3) — shown here on ≥sm; on xs it's rendered below in its own grid area to keep strict order */}
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Kelowna, BC
                </Typography>
                <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <iframe
                    title="Kelowna Map"
                    src="https://www.google.com/maps?q=Kelowna,+BC&output=embed"
                    width="100%"
                    height="140"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Kelowna map (3) only for xs to preserve exact order 1→6 */}
          <Box sx={{ gridArea: "map_kel", display: { xs: "block", sm: "none" } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Kelowna, BC
            </Typography>
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <iframe
                title="Kelowna Map (mobile)"
                src="https://www.google.com/maps?q=Kelowna,+BC&output=embed"
                width="100%"
                height="140"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>

          {/* 4. Site Map */}
          <Stack spacing={1} sx={{ gridArea: "sitemap" }}>
            <Typography variant="h6">Site Map</Typography>
            <Link component={RouterLink} to="/" underline="hover">
              Home
            </Link>
            <Link component={RouterLink} to="/about" underline="hover">
              About
            </Link>
            <Link component={RouterLink} to="/contact" underline="hover">
              Contact
            </Link>
            <Link component={RouterLink} to="/sos" underline="hover">
              SOS RustDesk
            </Link>
          </Stack>

          {/* 5. Sectors */}
          <Stack spacing={1} sx={{ gridArea: "sectors" }}>
            <Typography variant="h6">Sectors</Typography>
            <Link component={RouterLink} to="/sectors" underline="hover">
              All Sectors
            </Link>
            {SECTORS.map(({ key, title, href }) => (
              <Link
                key={key}
                component={RouterLink}
                to={href || `/sectors#${key}`}
                underline="hover"
              >
                {title}
              </Link>
            ))}
          </Stack>

          {/* 6. Services */}
          <Stack spacing={1} sx={{ gridArea: "services" }}>
            <Typography variant="h6">Services</Typography>
            <Link component={RouterLink} to="/services" underline="hover">
              All Services
            </Link>
            {SERVICES.map(({ key, title }) => (
              <Link
                key={key}
                component={RouterLink}
                to={`/services#${key}`}
                underline="hover"
              >
                {title}
              </Link>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} Backslash Designs. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
