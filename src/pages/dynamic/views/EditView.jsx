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
    <Box sx={{ border: "2px dashed #888", borderRadius: 1, p: 2, width: "100%" }}>
      {children}
    </Box>
  ) : (
    <>{children}</>
  );
}
