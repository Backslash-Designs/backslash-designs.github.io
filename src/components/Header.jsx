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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";
import { SERVICES } from "../pages/home/Services.jsx";

export default function Header({ onOpenMobileMenu }) {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const isDark = theme.palette.mode === "dark";
    const rectSrc = isDark ? "/backslash-logo-rect-dark.png" : "/backslash-logo-rect-light.png";
    const iconSrc = isDark ? "/backslash-icon-dark.png" : "/backslash-icon-light.png";
    const smUp = useMediaQuery(theme.breakpoints.up("sm"));

    const [svcAnchor, setSvcAnchor] = React.useState(null);
    const svcOpen = Boolean(svcAnchor);
    const openServicesMenu = (e) => setSvcAnchor(e.currentTarget);
    const closeServicesMenu = () => setSvcAnchor(null);

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

            {/* Services dropdown (desktop only) */}
            <Button
                color="inherit"
                onClick={openServicesMenu}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
                aria-haspopup="menu"
                aria-controls={svcOpen ? "services-menu" : undefined}
                aria-expanded={svcOpen ? "true" : undefined}
                >
                Services
            </Button>
            <Menu
                id="services-menu"
                anchorEl={svcAnchor}
                open={svcOpen}
                onClose={closeServicesMenu}
                keepMounted
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                MenuListProps={{ dense: true }}
            >
            <MenuItem component={RouterLink} to="/services" onClick={closeServicesMenu}>
                All Services
              </MenuItem>
              <Divider />
              {SERVICES.map(({ key, title }) => (
                <MenuItem
                  key={key}
                  component={RouterLink}
                  to={`/services#${key}`}
                  onClick={closeServicesMenu}
                >
                  {title}
                </MenuItem>
              ))}
            </Menu>

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
