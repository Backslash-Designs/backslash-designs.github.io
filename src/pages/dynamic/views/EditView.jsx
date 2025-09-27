import React from "react";
import Box from "@mui/material/Box";

// Global edit mode key
const EDIT_KEY = "editMode";

// Read the current state
const readEditMode = () =>
  typeof window !== "undefined" && localStorage.getItem(EDIT_KEY) === "1";

// Subscribe to global changes (storage + custom event)
function useGlobalEditMode() {
  const [editMode, setEditMode] = React.useState(readEditMode);

  React.useEffect(() => {
    const refresh = () => setEditMode(readEditMode());
    window.addEventListener("storage", refresh);
    window.addEventListener("editmode-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("editmode-change", refresh);
    };
  }, []);

  return editMode;
}

/**
 * Global edit mode:
 * - Enabled when localStorage.editMode === "1"
 * - Toggle via:
 *   - URL param: ?edit=1 / ?edit=0 (handled in App)
 *   - Keyboard: Ctrl+Shift+E (handled in Layout)
 *   - Exit button in SystemAnnouncements
 */
export default function EditView({ /* edit (ignored) */ children }) {
  const editMode = useGlobalEditMode();
  return editMode ? (
    <Box
      data-edit-view
      sx={{
        border: "2px dashed",
        borderColor: "#888",
        borderRadius: 1,
        p: 2,
        width: "100%",
        position: "relative",
        transition: "border-color 0.2s ease, transform 120ms ease, box-shadow 120ms ease",
        willChange: "transform, box-shadow",
        "&:hover:not(:has([data-edit-view]:hover))": {
          borderColor: "primary.main",
          transform: "scale(1.01)",
          boxShadow: 3,
          zIndex: 1,
        },
      }}
    >
      {children}
    </Box>
  ) : (
    <>{children}</>
  );
}
