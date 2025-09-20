import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import UnderConstruction from "./pages/UnderConstruction.jsx";

function shouldShowMaintenance() {
  const envFlag = String(import.meta.env.VITE_MAINTENANCE ?? "0").toLowerCase();
  const maintenanceOn = envFlag === "1" || envFlag === "true";

  // Allow ?preview=1 to bypass (persist in localStorage)
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("preview") === "1") {
      localStorage.setItem("previewMode", "1");
      url.searchParams.delete("preview");
      window.history.replaceState({}, "", url.toString());
    }
  } catch { /* noop */ }

  const preview = typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";
  return maintenanceOn && !preview;
}

export default function App() {
  const maintenance = useMemo(shouldShowMaintenance, []);

  if (maintenance) {
    return <UnderConstruction />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
