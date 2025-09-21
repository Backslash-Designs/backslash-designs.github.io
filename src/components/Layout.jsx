import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header.jsx";
import SystemAnnouncements from "./SystemAnnouncements.jsx";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: (t) => t.palette.background.paper,
        }}
      >
        <SystemAnnouncements />
        <Header />
      </Box>
      {/*<Container component="main" sx={{ flex: 1, display: "grid", placeItems: "center", py: 4 }}>*/}
        <Outlet />
      {/*</Container>*/}
    </Box>
  );
}
