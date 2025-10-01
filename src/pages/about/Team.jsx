import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon, // X
} from "@mui/icons-material";

/* ---------- Data ---------- */
export const TEAM = [
  {
    name: "Josiah Ledua",
    title: "Founder, Backslash Designs",
    photo: "/josiah-ledua.JPEG",
    bio: [
      "Josiah Ledua is the founder of Backslash Designs, an IT solutions and managed services provider focused on delivering technology that grows with businesses while staying dependable and secure. With more than a decade of experience, he has supported non-profits, media organizations, and small businesses in areas such as Microsoft 365, cloud services, networking, and cybersecurity.",
      "He holds an Honors Bachelor of Science in Computer Science from Lakehead University and an Electronics Technologist Diploma from Confederation College. Guided by the core values of Scalability, Reliability, and Security, Josiah works to ensure that clients have IT systems they can trust to adapt, perform, and protect.",
    ],
    social: {
      x: "https://x.com/jbledua",
      instagram: "https://www.instagram.com/jbledua/",
      linkedin: "https://www.linkedin.com/in/jbledua/",
      github: "https://github.com/jbledua",
    },
  },
];

const SOCIAL_ICONS = {
  x: { Icon: TwitterIcon, label: "X (Twitter)" },
  instagram: { Icon: InstagramIcon, label: "Instagram" },
  linkedin: { Icon: LinkedInIcon, label: "LinkedIn" },
  github: { Icon: GitHubIcon, label: "GitHub" },
};

/* ---------- Component ---------- */
export default function Team() {
  const [expanded, setExpanded] = React.useState({});

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        About Our Team
      </Typography>

      {TEAM.map((m) => {
        const isExpanded = !!expanded[m.name];
        return (
          <Box key={m.name} sx={{ mb: 5, textAlign: "center" }}>
            {/* Name + Title */}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {m.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
              {m.title}
            </Typography>

            {/* Photo + Bio (responsive) */}
            <Box
              tabIndex={0}
              sx={{
                width: "min(900px, 100%)",
                mx: "auto",
                position: { xs: "relative", sm: "static" },
                display: { xs: "block", sm: "flex" },
                alignItems: { sm: "stretch" },
                gap: { sm: 2 },
                borderRadius: 2,
                overflow: { xs: "hidden", sm: "visible" },
                boxShadow: (t) => t.shadows[1],
                // Removed fixed square wrapper so it can grow with content on mobile
                // aspectRatio: { xs: "1 / 1", sm: "unset" },
                "&:hover .overlay, &:focus-within .overlay": {
                  // No slide on mobile; desktop unchanged
                  transform: { xs: "none", sm: "none" },
                },
                "@media (prefers-reduced-motion: reduce)": {
                  "& .overlay": { transition: "none" },
                },
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: "40%" },
                  minWidth: 0,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: (t) => t.palette.action.hover,
                  // Keep the image square on mobile while allowing container to grow
                  aspectRatio: { xs: "1 / 1", sm: "unset" },
                }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>

              {/* Bio panel — flows below image on mobile, side-by-side on desktop */}
              <Box
                className="overlay"
                role="region"
                aria-label={`${m.name} bio`}
                sx={{
                  // Make it part of the document flow on mobile
                  position: { xs: "relative", sm: "relative" },
                  // Remove absolute positioning props on mobile
                  top: { xs: "auto", sm: "auto" },
                  right: { xs: "auto", sm: "auto" },
                  height: { xs: "auto", sm: "auto" },
                  width: { xs: "100%", sm: "60%" },
                  bgcolor: (t) => t.palette.background.paper,
                  color: (t) => t.palette.text.primary,
                  boxShadow: { xs: "none", sm: "none" },
                  borderLeft: { sm: (t) => `1px solid ${t.palette.divider}` },
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  // No slide-in on mobile; desktop stays visible
                  transform: { xs: "none", sm: "none" },
                  transition: { xs: "none", sm: "none" },
                  // Use page scroll; remove inner scroll
                  // overflow: "auto",
                  borderRadius: { sm: 2 },
                }}
              >
                <Box sx={{ maxWidth: 800 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    About {m.name.split(" ")[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    {m.bio[0]}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1.5,
                      opacity: 0.95,
                      display: { xs: isExpanded ? "block" : "none", sm: "block" },
                    }}
                  >
                    {m.bio[1]}
                  </Typography>

                  {/* Mobile-only Read more / Show less */}
                  {m.bio?.length > 1 && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [m.name]: !isExpanded }))
                      }
                      aria-expanded={isExpanded}
                      sx={{ mt: 1, px: 0, display: { xs: "inline-flex", sm: "none" } }}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </Button>
                  )}

                  <Typography
                    variant="caption"
                    sx={{ display: { xs: "none", sm: "none" }, mt: 1.5, opacity: 0.7 }}
                  >
                    Tap outside this panel to close.
                  </Typography>
                </Box>

                {/* Social icons moved here, directly under the bio and beside the photo */}
                {m.social && Object.keys(m.social).length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {Object.entries(m.social).map(([key, url]) => {
                      if (!url) return null;
                      const meta = SOCIAL_ICONS[key];
                      if (!meta) return null;
                      const { Icon, label } = meta;
                      return (
                        <Tooltip title={label} key={key}>
                          <IconButton
                            component="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            aria-label={`${m.name} on ${label}`}
                            sx={{ color: (t) => t.palette.text.secondary }}
                          >
                            <Icon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}