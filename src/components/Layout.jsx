import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const preview =
    typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";

  return (
    <div className="app-shell">
      {preview && (
        <div style={{
          background: "#1f6feb",
          color: "white",
          fontSize: 12,
          padding: "6px 12px",
          textAlign: "center"
        }}>
          Preview Mode — site is under construction.
          <button
            onClick={() => { localStorage.removeItem("previewMode"); location.reload(); }}
            style={{
              marginLeft: 8,
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 8,
              background: "transparent",
              color: "white",
              cursor: "pointer",
              padding: "2px 8px",
              fontSize: 12
            }}
          >
            Exit
          </button>
        </div>
      )}

      <header className="toolbar">Toolbar</header>
      <main className="routable">
        <Outlet />
      </main>
    </div>
  );
}
