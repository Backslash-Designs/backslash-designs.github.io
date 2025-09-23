import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Link as RouterLink } from "react-router-dom";
import { SECTORS } from "../pages/sectors/SectorsPage.jsx";
import { SERVICES } from "../pages/services/ServicesPage.jsx";
import { useTheme } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X"; // If not available, use TwitterIcon as fallback

export default function Footer() {
  const theme = useTheme();
  const logoSrc =
    theme.palette.mode === "dark"
      ? "/backslash-logo.png"
      : "/backslash-logo.png";

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
        {/* ---- Top row: Contact (left) + Nav grid (right) ---- */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          sx={{
            mb: 2,
            alignItems: "flex-start",
          }}
        >
          {/* ---- Grid that matches your mockup ---- */}
          <Box
            sx={{
              mb: 2,
              display: "grid",
              // 1st col = left panel; next 3 = the three right columns
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(320px, 520px) repeat(3, minmax(180px, 1fr))",
              },
              // two rows on desktop: (1) logo+contact vs right columns, (2) maps row
              gridTemplateRows: { xs: "auto", md: "auto auto" },
              columnGap: { xs: 0, md: 4 },
              rowGap: { xs: 3, md: 2 },
              alignItems: "start",
            }}
          >
            {/* LEFT TOP: logo + contact text side-by-side */}
            <Box
              sx={{
                gridColumn: { xs: "1 / -1", md: "1 / 2" },
                gridRow: { xs: "auto", md: "1 / 2" },
              }}
            >
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
                    style={{ width: 200, height: "auto", display: "block" }}
                  />
                </Box>

                {/* Contact text */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Contact
                  </Typography>

                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    <Link href="mailto:hello@backslashdesigns.ca" underline="hover">
                      hello@backslashdesigns.ca
                    </Link>
                    <br />
                    <Link href="tel:+18075551234" underline="hover">
                      (807) 555-1234
                    </Link>
                  </Typography>
                  {/* Social Media Links */}
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={2}>
                      <Link
                        href="https://x.com/backslashdesigns"
                        target="_blank"
                        rel="noopener"
                        aria-label="X"
                        color="inherit"
                      >
                        {/* Use XIcon if available, otherwise TwitterIcon */}
                        <XIcon fontSize="medium" />
                      </Link>
                      <Link
                        href="https://instagram.com/backslashdesigns"
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

            {/* RIGHT: three columns that span both rows */}
            <Box
              sx={{
                gridColumn: { xs: "1 / -1", md: "2 / 5" },
                gridRow: { xs: "auto", md: "1 / 3" },
                pr: { md: 1 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  columnGap: 4,
                  rowGap: 2,
                }}
              >
                {/* Site Map */}
                <Stack spacing={1}>
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
                </Stack>

                {/* Sectors */}
                <Stack spacing={1}>
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

                {/* Services */}
                <Stack spacing={1}>
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
            </Box>

            {/* LEFT BOTTOM: two maps side-by-side */}
            <Box
              sx={{
                gridColumn: { xs: "1 / -1", md: "1 / 2" },
                gridRow: { xs: "auto", md: "2 / 3" },
                mt: { xs: 0, md: 1 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Thunder Bay
                  </Typography>
                  <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <iframe
                      title="Thunder Bay Map"
                      src="https://www.google.com/maps?q=Thunder+Bay,+ON&output=embed"
                      width="100%"
                      height="140"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Kelowna
                  </Typography>
                  <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <iframe
                      title="Kelowna Map"
                      src="https://www.google.com/maps?q=Kelowna,+BC&output=embed"
                      width="100%"
                      height="140"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} Backslash Designs. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
