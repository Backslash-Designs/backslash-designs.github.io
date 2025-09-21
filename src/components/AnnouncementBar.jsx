import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

/**
 * Props:
 * - severity: "info" | "success" | "warning" | "error" (default: "info")
 * - message: string | ReactNode
 * - action: ReactNode (e.g., a Button)
 * - storageKey?: string  // if set, “Dismiss” persists in localStorage
 * - defaultOpen?: boolean
 */

export default function AnnouncementBar({
  severity = "info",
  message,
  action,
  storageKey,
  defaultOpen = true,
}) {
  const [open, setOpen] = React.useState(() => {
    if (!storageKey || typeof window === "undefined") return defaultOpen;
    return localStorage.getItem(`ann.dismissed.${storageKey}`) !== "1";
  });

  const handleDismiss = () => {
    setOpen(false);
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(`ann.dismissed.${storageKey}`, "1");
    }
  };

  return (
    <Collapse in={open} unmountOnExit>
      <Box sx={{ position: "static" }}>
        <Alert
          severity={severity}
          variant="filled"
          action={
            <>
              {action}
              <Button
                color="inherit"
                size="small"
                onClick={handleDismiss}
                sx={{ ml: action ? 1 : 0 }}
              >
                Dismiss
              </Button>
            </>
          }
          sx={{ borderRadius: 0, alignItems: "center" }}
        >
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
}
