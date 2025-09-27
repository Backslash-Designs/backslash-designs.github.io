import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon, // used for X
} from "@mui/icons-material";

// Store team members here
const TEAM = [
  {
    name: "Josiah Ledua",
    title: "Founder, Backslash Designs",
    photo: "/josiah-ledua.JPEG",
    bio: [
      "Josiah Ledua is the founder of Backslash Designs, an IT solutions and managed services provider focused on delivering technology that grows with businesses while staying dependable and secure. With more than a decade of experience, he has supported non-profits, media organizations, and small businesses in areas such as Microsoft 365, cloud services, networking, and cybersecurity.",
      "He holds an Honors Bachelor of Science in Computer Science from Lakehead University and an Electronics Technologist Diploma from Confederation College. Guided by the core values of Scalability, Reliability, and Security, Josiah works to ensure that clients have IT systems they can trust to adapt, perform, and protect.",
    ],
    // Optional social links: add any of these keys with URLs to show icons
    social: {
      x: "https://x.com/jbledua",
      instagram: "https://www.instagram.com/jbledua/",
      linkedin: "https://www.linkedin.com/in/jbledua/",
      github: "https://github.com/jbledua",
    },
  },
];

// Map social keys to icons + labels
const SOCIAL_ICONS = {
  x: { Icon: TwitterIcon, label: "X (Twitter)" },
  instagram: { Icon: InstagramIcon, label: "Instagram" },
  linkedin: { Icon: LinkedInIcon, label: "LinkedIn" },
  github: { Icon: GitHubIcon, label: "GitHub" },
};

// Team component for About page
export default function Team() {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        About Our Team
      </Typography>

      {TEAM.map((m) => (
        <Box
          key={m.name}
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "flex-start" }, // was "center"
            gap: 3,
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            mb: 3,
          }}
        >
          {/* Avatar */}
          <Box
            sx={{
              width: { xs: "100%", sm: "50%" },
              maxWidth: { xs: "340px", sm: "none" },
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: (t) => t.palette.action.hover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 2, sm: 0 },
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

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {m.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.95 }}>
              {m.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              {m.bio[0]}
              <br />
              <br />
              {m.bio[1]}
            </Typography>

            {/* Social icons row */}
            {m.social && Object.keys(m.social).length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1.5, justifyContent: { xs: "center", sm: "flex-start" } }}
              >
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
      ))}
    </Box>
  );
}
