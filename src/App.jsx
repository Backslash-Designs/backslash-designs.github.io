import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/home/Home.jsx";
import About from "./pages/about/About.jsx";
import NotFound from "./pages/notfound/NotFound.jsx";
import Construction from "./pages/construction/Construction.jsx";
import ColorModeProvider from "./theme/ColorModeProvider.jsx";

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
  } catch {}
  const preview = typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";
  return on && !preview;
}

export default function App() {
  const maintenance = useMemo(shouldShowMaintenance, []);
  if (maintenance) return <Construction />;

  return (
    <ColorModeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ColorModeProvider>
  );
}
