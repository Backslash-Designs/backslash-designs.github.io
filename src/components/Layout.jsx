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
import Brightness4Icon from "@mui/icons-material/Brightness4"; // moon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // sun
import { useColorMode } from "../theme/ColorModeProvider.jsx";

export default function Layout() {
  const preview =
    typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";

  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {preview && (
        <Box
          sx={{
            bgcolor: "warning.main",
            color: "warning.contrastText",
            textAlign: "center",
            py: 0.5,
            fontSize: 12,
          }}
        >
          Preview Mode — site is under construction.
          <Button
            variant="outlined"
            size="small"
            sx={{
              ml: 1,
              borderColor: "rgba(0,0,0,.35)",
              color: "inherit",
              "&:hover": { borderColor: "rgba(0,0,0,.6)" },
            }}
            onClick={() => {
              localStorage.removeItem("previewMode");
              location.reload();
            }}
          >
            Exit
          </Button>
        </Box>
      )}

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

          <Tooltip title={`Switch to ${theme.palette.mode === "dark" ? "light" : "dark"} mode`}>
            <IconButton color="inherit" onClick={toggleColorMode} size="large" aria-label="toggle color mode">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, display: "grid", placeItems: "center", py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
