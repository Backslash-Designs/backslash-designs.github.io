import React from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./Header.jsx";
// CHANGED: use services/SystemAnnouncementsService
import SystemAnnouncements from "../services/SystemAnnouncementsService.jsx";
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
function MobileNavDrawer({ open, onClose }) {
  const [svcOpen, setSvcOpen] = React.useState(false);
  const toggleServices = () => setSvcOpen((v) => !v);

  // Add sectors collapse state
  const [sectorsOpen, setSectorsOpen] = React.useState(false);
  const toggleSectors = () => setSectorsOpen((v) => !v);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          // Removed top offset so the drawer covers the header
          top: 0,
          height: "100%",
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
          <ListItemButton component={RouterLink} to="/blog" onClick={onClose}>
            <ListItemText primary="Blog" />
          </ListItemButton>
          <Divider />
          <ListItemButton
            component={RouterLink}
            to="/contact"
            onClick={onClose}
            sx={{
              bgcolor: (t) => t.palette.primary.main,
              color: (t) => t.palette.primary.contrastText,
              "& .MuiListItemText-primary": { color: "inherit", fontWeight: 600 },
              "&:hover": { bgcolor: (t) => t.palette.primary.dark },
            }}
          >
            <ListItemText primary="Contact"/>
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

  // + scroll to top on route change (ignore hash-only changes)
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

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
      <MobileNavDrawer open={drawerOpen} onClose={closeMobileMenu} />
      <Outlet />
      <Footer />
    </Box>
  );
}
