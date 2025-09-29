import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header.jsx";
import SystemAnnouncements from "./SystemAnnouncements.jsx";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { SERVICES } from "../pages//services/ServicesPage.jsx";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VideocamIcon from "@mui/icons-material/Videocam";
import Footer from "./Footer.jsx";

const SECTORS = [
  { key: "broadcast", title: "Live Broadcast & Pro A/V", Icon: VideocamIcon },
  { key: "mental-health", title: "Mental Health & Clinical Practices", Icon: LocalHospitalIcon },
  { key: "non-profit", title: "Non-Profit Organizations", Icon: VolunteerActivismIcon },
];

// New: Drawer component that appears below the sticky top area
function MobileNavDrawer({ open, onClose, topOffset = 0 }) {
  const [svcOpen, setSvcOpen] = React.useState(false);
  const toggleServices = () => setSvcOpen((v) => !v);

  // Add sectors collapse state
  const [sectorsOpen, setSectorsOpen] = React.useState(false);
  const toggleSectors = () => setSectorsOpen((v) => !v);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          top: topOffset,
          height: `calc(100% - ${topOffset}px)`,
        },
      }}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItemButton component={RouterLink} to="/home" onClick={onClose}>
            <ListItemText primary="Home" />
          </ListItemButton>

          {/* Sectors parent (toggles nested list) */}
          <ListItemButton onClick={toggleSectors} aria-expanded={sectorsOpen ? "true" : "false"}>
            <ListItemText primary="Sectors" />
            {sectorsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={sectorsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/sectors"
                onClick={onClose}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="All Sectors" />
              </ListItemButton>
              {SECTORS.map(({ key, title, Icon }) => (
                <ListItemButton
                  key={key}
                  component={RouterLink}
                  to={`/sectors#${key}`}
                  onClick={onClose}
                  sx={{ pl: 4 }}
                >
                  {Icon && (
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Services parent (toggles nested list) */}
          <ListItemButton onClick={toggleServices} aria-expanded={svcOpen ? "true" : "false"}>
            <ListItemText primary="Services" />
            {svcOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={svcOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/services"
                onClick={onClose}
                sx={{ pl: 4 }}
              >
                <ListItemText primary="All Services" />
              </ListItemButton>
              {SERVICES.map(({ key, title, Icon }) => (
                <ListItemButton
                  key={key}
                  component={RouterLink}
                  to={`/services#${key}`}
                  onClick={onClose}
                  sx={{ pl: 4 }}
                >
                  {Icon && (
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <ListItemButton component={RouterLink} to="/about" onClick={onClose}>
            <ListItemText primary="About" />
          </ListItemButton>
          <Divider />
          <ListItemButton component={RouterLink} to="/contact" onClick={onClose}>
            <ListItemText primary="Contact US" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}

export default function Layout() {
  // Track combined height of SystemAnnouncements + Header to offset the Drawer
  const topRef = React.useRef(null);
  const [topOffset, setTopOffset] = React.useState(0);
  React.useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const update = () => setTopOffset(el.offsetHeight || 0);
    update();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (ro) ro.disconnect();
    };
  }, []);

  // Drawer open/close state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const openMobileMenu = () => setDrawerOpen(true);
  const closeMobileMenu = () => setDrawerOpen(false);

  // NEW: global keyboard toggle for Edit Mode (Ctrl+Shift+E)
  React.useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key?.toLowerCase?.() || "";
      if (e.ctrlKey && e.shiftKey && key === "e") {
        e.preventDefault();
        const enabled = localStorage.getItem("editMode") === "1";
        if (enabled) {
          localStorage.removeItem("editMode");
        } else {
          localStorage.setItem("editMode", "1");
        }
        window.dispatchEvent(new Event("editmode-change"));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        "--top-offset": `${topOffset}px`,
      }}
    >
      <Box
        ref={topRef}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: (t) => t.zIndex.appBar + 1,
          bgcolor: (t) => t.palette.background.paper,
        }}
      >
        <SystemAnnouncements />
        <Header onOpenMobileMenu={openMobileMenu} />
      </Box>
      <MobileNavDrawer open={drawerOpen} onClose={closeMobileMenu} topOffset={topOffset} />
      <Outlet />
      <Footer />
    </Box>
  );
}
