import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors";
import Fonts from "./Fonts"

const LOCAL_KEY = "color-scheme"; // 'light' | 'dark'

const getInitialMode = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(LOCAL_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const ColorModeContext = createContext({ mode: "light", toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export default function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    // Blue accent as primary
    const primaryMain = "#1f6feb";
    const primaryContrastText = "#ffffff";

    // Neutral secondary that flips for readability
    const secondaryMain = isDark ? "#1f2937" /* gray-800 */ : "#e5e7eb" /* gray-200 */;
    const secondaryContrastText = isDark ? "#ffffff" : "#111111";

    const backgroundDefault = isDark ? "#0f1216" : "#fafafa";
    const backgroundPaper = isDark ? "#12161c" : "#ffffff";

    return createTheme({
      palette: {
        mode,
        primary: { main: primaryMain, contrastText: primaryContrastText },
        secondary: { main: secondaryMain, contrastText: secondaryContrastText },
        warning: { main: amber[500], dark: amber[700], light: amber[300], contrastText: "#111" },
        background: { default: backgroundDefault, paper: backgroundPaper },
        text: isDark ? { primary: "#ffffff" } : { primary: "#111111" },
      },
      shape: { borderRadius: 12 },
    });
  }, [mode]);

  // Update favicon + theme-color to match current mode (runtime override)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const href =
      mode === "dark"
        ? "/backslash-icon-square-trans-dark.png"
        : "/backslash-icon-square-trans-light.png";

    let link = document.querySelector('link#app-favicon');
    if (!link) {
      link = document.createElement("link");
      link.id = "app-favicon";
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;

    // Also update theme-color meta dynamically (nice for Android address bar)
    const color = mode === "dark" ? "#0f1216" : "#fafafa";
    let meta = document.querySelector('meta#app-theme-color[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.id = "app-theme-color";
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, toggleColorMode: () => setMode((m) => (m === "light" ? "dark" : "light")) }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Fonts />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
