import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Layout() {
  const preview = typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {preview && (
        <Box
          sx={{
            bgcolor: "warning.main",
            color: "warning.contrastText",
            textAlign: "center",
            py: 0.5,
            fontSize: 12
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
              "&:hover": { borderColor: "rgba(0,0,0,.6)" }
            }}
            onClick={() => { localStorage.removeItem("previewMode"); location.reload(); }}
          >
            Exit
          </Button>
        </Box>
      )}

      <AppBar position="static" color="secondary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            Backslash Designs
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/home">Home</Button>
            <Button color="inherit" component={RouterLink} to="/about">About</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, display: "grid", placeItems: "center", py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
