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
import { SERVICES } from "../pages//services/ServicesPage.jsx";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideocamIcon from "@mui/icons-material/Videocam";
import MenuIcon from "@mui/icons-material/Menu";
import useScrollTrigger from "@mui/material/useScrollTrigger"; // added

// Add scroll elevation helper
function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  return children ? React.cloneElement(children, { elevation: trigger ? 4 : 0 }) : null;
}

const SECTORS = [
    { key: "broadcast", title: "Live Broadcast & Pro A/V", Icon: VideocamIcon },
    { key: "mental-health", title: "Mental Health & Clinical Practices", Icon: LocalHospitalIcon },
    { key: "non-profit", title: "Non-Profit Organizations", Icon: VolunteerActivismIcon },
];

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

    const [sectorAnchor, setSectorAnchor] = React.useState(null);
    const sectorOpen = Boolean(sectorAnchor);
    const openSectorMenu = (e) => setSectorAnchor(e.currentTarget);
    const closeSectorMenu = () => setSectorAnchor(null);

    return (
        <ElevationScroll>
        <AppBar position="static" color="secondary" enableColorOnDark>
            <Toolbar sx={{ gap: 1 }}>
                {/* Logo — always go home */}
                <Box
                component={RouterLink}
                to="/"
                aria-label="Go to home"
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

                {/* Reordered menu buttons */}
                <Button color="inherit" component={RouterLink} to="/home" sx={{ display: { xs: "none", sm: "inline-flex" } }}>Home</Button>
                
                {/* Sectors dropdown (desktop only) */}
                <Button
                    color="inherit"
                    onClick={openSectorMenu}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    aria-haspopup="menu"
                    aria-controls={sectorOpen ? "sectors-menu" : undefined}
                    aria-expanded={sectorOpen ? "true" : undefined}
                >
                    Sectors
                </Button>
                <Menu
                    id="sectors-menu"
                    anchorEl={sectorAnchor}
                    open={sectorOpen}
                    onClose={closeSectorMenu}
                    keepMounted
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    MenuListProps={{ dense: true }}
                >
                    <MenuItem component={RouterLink} to="/sectors" onClick={closeSectorMenu}>
                        All Sectors
                    </MenuItem>
                    <Divider />
                    {SECTORS.map(({ key, title, Icon }) => (
                        <MenuItem
                            key={key}
                            component={RouterLink}
                            to={`/sectors#${key}`}
                            onClick={closeSectorMenu}
                        >
                            {Icon && <Icon fontSize="small" style={{ marginRight: 8 }} />}
                            {title}
                        </MenuItem>
                    ))}
                </Menu>

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
                {SERVICES.map(({ key, title, Icon }) => (
                    <MenuItem
                        key={key}
                        component={RouterLink}
                        to={`/services#${key}`}
                        onClick={closeServicesMenu}
                    >
                        {Icon && <Icon fontSize="small" style={{ marginRight: 8 }} />}
                        {title}
                    </MenuItem>
                ))}
                </Menu>

                <Button color="inherit" component={RouterLink} to="/about" sx={{ display: { xs: "none", sm: "inline-flex" } }}>About</Button>
                {/* NEW: Blog link (desktop) */}
                <Button color="inherit" component={RouterLink} to="/blog" sx={{ display: { xs: "none", sm: "inline-flex" } }}>Blog</Button>
                <Button color="primary" component={RouterLink} variant="contained" to="/contact" >Contact</Button>
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
                {/* Mobile hamburger button moved to far right */}
                <IconButton
                    color="inherit"
                    onClick={onOpenMobileMenu}
                    size="large"
                    edge="end"
                    aria-label="Open menu"
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        </ElevationScroll>
    );
}

