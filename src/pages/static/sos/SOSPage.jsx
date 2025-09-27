import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

// Simple user agent parser for OS, version, arch, browser
function parseUA() {
  const ua = navigator.userAgent || "";
  let os = "Unknown", version = "", arch = "Unknown", browser = "Unknown";

  // OS detection
  if (/Windows NT/.test(ua)) {
    os = "Windows";
    const match = ua.match(/Windows NT ([\d.]+)/);
    version = match ? match[1] : "";
    arch = /WOW64|Win64|x64/.test(ua) ? "x64" : /ARM|aarch64/.test(ua) ? "ARM" : "x86";
  } else if (/Mac OS X/.test(ua)) {
    os = "macOS";
    const match = ua.match(/Mac OS X ([\d_]+)/);
    version = match ? match[1].replace(/_/g, ".") : "";
    arch = /ARM|Apple/.test(ua) ? "ARM (Apple Silicon)" : "x64";
  } else if (/Android/.test(ua)) {
    os = "Android";
    const match = ua.match(/Android ([\d.]+)/);
    version = match ? match[1] : "";
    arch = /arm|aarch64/i.test(ua) ? "ARM" : "x86";
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    os = "iOS";
    const match = ua.match(/OS ([\d_]+)/);
    version = match ? match[1].replace(/_/g, ".") : "";
    arch = "ARM";
  }

  // Browser detection (basic)
  if (/Chrome\/([\d.]+)/.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\/([\d.]+)/.test(ua) && !/Chrome/.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\/([\d.]+)/.test(ua)) {
    browser = "Firefox";
  } else if (/Edg\/([\d.]+)/.test(ua)) {
    browser = "Edge";
  } else if (/MSIE|Trident/.test(ua)) {
    browser = "Internet Explorer";
  }

  return { os, version, arch, browser };
}

export default function SOSPage() {
  const [info, setInfo] = React.useState({ os: "", version: "", arch: "", browser: "" });

  React.useEffect(() => {
    setInfo(parseUA());
  }, []);

  // Placeholder download links
  const downloadLinks = {
    Windows: "https://github.com/Backslash-Designs/sos/releases/latest/download/sos-windows.exe",
    macOS: "https://github.com/Backslash-Designs/sos/releases/latest/download/sos-macos.pkg",
    Android: "https://github.com/Backslash-Designs/sos/releases/latest/download/sos-android.apk",
    iOS: "#", // Not supported
  };

  // Instructions per OS
  const instructions = {
    Windows: (
      <>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Download and run the SOS agent for Windows. If prompted, allow the app through Windows Defender SmartScreen.
        </Typography>
        <Typography variant="body2">
          <b>Download:</b>{" "}
          <a href={downloadLinks.Windows} target="_blank" rel="noopener">
            sos-windows.exe
          </a>
        </Typography>
      </>
    ),
    macOS: (
      <>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Download the SOS agent for macOS. Open the .pkg file and follow the installation prompts. You may need to allow the app in System Preferences &gt; Security &amp; Privacy.
        </Typography>
        <Typography variant="body2">
          <b>Download:</b>{" "}
          <a href={downloadLinks.macOS} target="_blank" rel="noopener">
            sos-macos.pkg
          </a>
        </Typography>
      </>
    ),
    Android: (
      <>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Download the SOS agent APK for Android. You may need to allow installation from unknown sources.
        </Typography>
        <Typography variant="body2">
          <b>Download:</b>{" "}
          <a href={downloadLinks.Android} target="_blank" rel="noopener">
            sos-android.apk
          </a>
        </Typography>
      </>
    ),
    iOS: (
      <>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Sorry, SOS agent is not available for iOS at this time.
        </Typography>
      </>
    ),
    Unknown: (
      <>
        <Typography variant="body2">
          Your operating system could not be detected. Please contact support for assistance.
        </Typography>
      </>
    ),
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 }, maxWidth: 600, mx: "auto" }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          SOS Remote Agent Download
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page detects your device and provides the correct download and installation instructions for the SOS remote agent.
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <b>Detected OS:</b> {info.os || "Unknown"}
          </Typography>
          <Typography variant="body2">
            <b>Version:</b> {info.version || "Unknown"}
          </Typography>
          <Typography variant="body2">
            <b>Architecture:</b> {info.arch || "Unknown"}
          </Typography>
          <Typography variant="body2">
            <b>Browser:</b> {info.browser || "Unknown"}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {instructions[info.os] || instructions.Unknown}
      </Paper>
    </Box>
  );
}
