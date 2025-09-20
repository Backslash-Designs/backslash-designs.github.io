import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h1>404 — Page Not Found</h1>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <p><Link to="/">Go back home</Link></p>
    </div>
  );
}
