import React, { useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/static/home/HomePage.jsx";
import About from "./pages/static/about/AboutPage.jsx";
import NotFound from "./pages/static/notfound/NotFoundPage.jsx";
import Construction from "./pages/static/construction/ConstructionPage.jsx";
import ColorModeProvider from "./theme/ColorModeProvider.jsx";
import Contact from "./pages/static/contact/ContactPage.jsx"; 
import { ServicesPage } from "./pages/static/services/ServicesPage.jsx"; 
import SectorsPage from "./pages/static/sectors/SectorsPage.jsx";
import SOSPage from "./pages/static/sos/SOSPage.jsx";
import MultiDynamicPage from "./pages/dynamic/MultiDynamicPage.jsx";
import { getPages, subscribe } from "./services/DynamicPagesService.js";

function shouldShowMaintenance() {
  const envFlag = String(import.meta.env.VITE_MAINTENANCE ?? "0").toLowerCase();
  const on = envFlag === "1" || envFlag === "true";
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("preview") === "1") {
      localStorage.setItem("previewMode", "1");
      url.searchParams.delete("preview");
      window.history.replaceState({}, "", url.toString());
    }

    // NEW: handle ?edit=1 / ?edit=0
    const editParam = url.searchParams.get("edit");
    if (editParam !== null) {
      const onValues = ["1", "true", "yes", "on"];
      const enable = onValues.includes(editParam.toLowerCase());
      if (enable) {
        localStorage.setItem("editMode", "1");
      } else {
        localStorage.removeItem("editMode");
      }
      // notify listeners (same-tab)
      window.dispatchEvent(new Event("editmode-change"));
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    }
  } catch {}
  const preview = typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";
  return on && !preview;
}

export default function App() {
  const maintenance = useMemo(shouldShowMaintenance, []);

  // const dynamicPages = useMemo(() => getPages(), []);
  const [dynamicPages, setDynamicPages] = React.useState(() => getPages());
  React.useEffect(() => {
    const unsub = subscribe(({ pages }) => setDynamicPages(pages));
    return unsub;
  }, []);

  const dynamicRoutes = useMemo(
    () =>
      dynamicPages.map((p) => (
        <Route key={p.path} path={p.path} element={<MultiDynamicPage path={p.path} />} />
      )),
    [dynamicPages]
  );

  if (maintenance) return <Construction />;

  return (
    <ColorModeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/sos" element={<SOSPage />} />
          {/* Removed explicit /dynamic route; now auto-generated */}
          {dynamicRoutes}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ColorModeProvider>
  );
}
