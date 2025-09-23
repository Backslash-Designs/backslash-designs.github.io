import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Team component for About page
export default function Team() {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        About Our Team
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 3,
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
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
            src="/josiah-ledua.JPEG"
            alt="Josiah Ledua"
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
            Josiah Ledua
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.95 }}>
            Founder, Backslash Designs
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Josiah Ledua is the founder of Backslash Designs, an IT solutions and managed services provider focused on delivering technology that grows with businesses while staying dependable and secure. With more than a decade of experience, he has supported non-profits, media organizations, and small businesses in areas such as Microsoft 365, cloud services, networking, and cybersecurity.
            <br /><br />
            He holds an Honors Bachelor of Science in Computer Science from Lakehead University and an Electronics Technologist Diploma from Confederation College. Guided by the core values of Scalability, Reliability, and Security, Josiah works to ensure that clients have IT systems they can trust to adapt, perform, and protect.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
