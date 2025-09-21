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

// New: Drawer component that appears below the sticky top area
function MobileNavDrawer({ open, onClose, topOffset = 0 }) {
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

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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

      {/* Drawer opens beneath the sticky announcements + header */}
      
      <MobileNavDrawer open={drawerOpen} onClose={closeMobileMenu} topOffset={topOffset} />
        
        <Outlet />

    </Box>
  );
}
