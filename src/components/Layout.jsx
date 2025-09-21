import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../theme/ColorModeProvider.jsx";
import SystemAnnouncements from "./SystemAnnouncements.jsx";

export default function Layout() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Sticky header wrapper keeps banner + app bar at top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: (t) => t.palette.background.paper,
        }}
      >
        <SystemAnnouncements />
        <AppBar position="static" color="secondary" enableColorOnDark>
          <Toolbar sx={{ gap: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}
            >
              Backslash Designs
            </Typography>

            <Button color="inherit" component={RouterLink} to="/home">Home</Button>
            <Button color="inherit" component={RouterLink} to="/about">About</Button>
            <Button color="primary" component={RouterLink} variant="contained" to="/contact">Contact US</Button>
            <Tooltip title={`Switch to ${theme.palette.mode === "dark" ? "light" : "dark"} mode`}>
              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                size="large"
                aria-label="toggle color mode"
              >
                {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Box>

      {/*<Container component="main" sx={{ flex: 1, display: "grid", placeItems: "center", py: 4 }}>*/}
        <Outlet />
      {/*</Container>*/}
    </Box>
  );
}
