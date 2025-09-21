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
    // Optional: expose on <html> for any non-MUI CSS you might add later
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(() => {
    const isDark = mode === "dark";
    return createTheme({
      palette: {
        mode,
        primary: { main: "#1f6feb" },
        secondary: { main: "#f45b47" },
        warning: { main: amber[500], dark: amber[700], light: amber[300], contrastText: "#111" },
        background: isDark
          ? { default: "#0f1216", paper: "#12161c" }
          : { default: "#fafafa", paper: "#ffffff" },
        text: isDark ? { primary: "#ffffff" } : { primary: "#111111" },
      },
      shape: { borderRadius: 12 },
    });
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
