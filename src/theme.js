import { createTheme } from "@mui/material/styles";
import { amber } from "@mui/material/colors"; // <-- add

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1f6feb" },
    secondary: { main: "#f45b47" },
    background: { default: "#0f1216", paper: "#12161c" },
    text: { primary: "#ffffff" },

    // NEW: warning palette for the preview banner
    warning: {
      main: amber[500],     // #FFC107-ish
      dark: amber[700],
      light: amber[300],
      // optional: force readable text color
      contrastText: "#111"
    }
  },
  shape: { borderRadius: 12 }
});

export default theme;
