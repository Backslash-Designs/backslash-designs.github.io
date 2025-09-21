import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "../theme/ColorModeProvider.jsx";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Header({ onOpenMobileMenu }) {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const isDark = theme.palette.mode === "dark";
    const rectSrc = isDark ? "/backslash-logo-rect-dark.png" : "/backslash-logo-rect-light.png";
    const iconSrc = isDark ? "/backslash-icon-dark.png" : "/backslash-icon-light.png";
    const smUp = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <AppBar position="static" color="secondary" enableColorOnDark>
        <Toolbar sx={{ gap: 1 }}>
            {/* Logo — on desktop go home, on mobile open Drawer */}
            <Box
            component={smUp ? RouterLink : "button"}
            to={smUp ? "/" : undefined}
            onClick={smUp ? undefined : onOpenMobileMenu}
            aria-label={smUp ? "Go to home" : "Open menu"}
            sx={{
                color: "inherit",
                textDecoration: "none",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                p: 0,
                m: 0,
                border: 0,
                background: "none",
                cursor: "pointer",
            }}
            >
            <Box
                component="img"
                src={rectSrc}
                alt="Backslash Designs"
                sx={{ display: { xs: "none", sm: "block" }, height: 36, width: "auto" }}
            />
            <Box
                component="img"
                src={iconSrc}
                alt="Backslash Designs"
                sx={{ display: { xs: "block", sm: "none" }, height: 28, width: "auto" }}
            />
            </Box>

            <Button color="inherit" component={RouterLink} to="/home" sx={{ display: { xs: "none", sm: "inline-flex" } }}>Home</Button>
            <Button color="inherit" component={RouterLink} to="/about" sx={{ display: { xs: "none", sm: "inline-flex" } }}>About</Button>
            <Button color="primary" component={RouterLink} variant="contained" to="/contact" >Contact US</Button>
            <Tooltip title={`Switch to ${theme.palette.mode === "dark" ? "light" : "dark"} mode`}>
            <IconButton
                color="inherit"
                onClick={toggleColorMode}
                size="large"
                aria-label="toggle color mode"
            >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            </Tooltip>
        </Toolbar>
        </AppBar>
    );
}
