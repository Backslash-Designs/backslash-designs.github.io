import React from "react";
import { Link } from "react-router-dom";

export default function UnderConstruction() {
  return (
    <>
      {/* Local reset so we don't need styles.css */}
      <style>{`
        html, body, #root { height: 100%; margin: 0; }
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",   // padding won't add extra height
          display: "grid",
          placeItems: "center",
          background: "#0f1216",
          color: "white",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 720 }}>
          <img
            src="/backslash-logo.png"
            alt="Backslash Designs"
            style={{
              width: 500,
              maxWidth: "60vw",
              height: "auto",
              marginBottom: 16,
            }}
          />

          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            We’re building something new.
          </h1>
          <p style={{ opacity: 0.85, marginTop: 8 }}>
            The site is currently under construction. Check back soon for updates.
          </p>

          <div style={{ marginTop: 24 }}>
            <a
              href="https://github.com/Backslash-Designs"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 10,
                textDecoration: "none",
                color: "white",
              }}
            >
              Visit our GitHub
            </a>
          </div>

          <p style={{ marginTop: 16, opacity: 0.65, fontSize: 12 }}>
            (If you’re a maintainer, append <code>?preview=1</code> to bypass.)
          </p>

          <p style={{ marginTop: 12 }}>
            <Link to="/" style={{ color: "#fff" }}>Back to Home</Link>
          </p>
        </div>
      </div>
    </>
  );
}
