import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// CHANGED: adjusted path after moving to services/
import AnnouncementBar from "../components/AnnouncementBar";

/**
 * Computes which system-wide announcements to show.
 * Add new ones by pushing into the `announcements` array.
 */
export default function SystemAnnouncements() {
    // NEW: track edit mode with state so banner hides immediately
    const [editMode, setEditMode] = React.useState(
        () => typeof window !== "undefined" && localStorage.getItem("editMode") === "1"
    );

    React.useEffect(() => {
        const read = () =>
            setEditMode(typeof window !== "undefined" && localStorage.getItem("editMode") === "1");
        const onStorage = (e) => { if (!e || e.key === "editMode") read(); };
        const onCustom = () => read();
        window.addEventListener("storage", onStorage);
        window.addEventListener("editmode-change", onCustom);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("editmode-change", onCustom);
        };
    }, []);

    const announcements = [];

    // Preview Mode banner (uses theme.palette.warning)
    const preview =
        typeof window !== "undefined" && localStorage.getItem("previewMode") === "1";
    if (preview) {
        announcements.push({
            key: "preview-mode",
            severity: "warning",
            message: "Preview Mode — site is under construction.",
            action: (
                <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        localStorage.removeItem("previewMode");
                        location.reload();
                    }}
                    sx={{
                        borderColor: "rgba(0,0,0,.35)",
                        "&:hover": { borderColor: "rgba(0,0,0,.6)" },
                    }}
                >
                    Exit
                </Button>
            ),
      //storageKey: "preview-mode", // uncomment if you want Dismiss to persist
        });
    }

    // Edit Mode banner
    if (editMode) {
        announcements.push({
            key: "edit-mode",
            severity: "info",
            message: "Edit Mode — inline edit borders are visible.",
            action: (
                <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        localStorage.removeItem("editMode");
                        window.dispatchEvent(new Event("editmode-change"));
                        setEditMode(false); // hide immediately without refresh
                    }}
                >
                    Exit
                </Button>
            ),
        });
    }

    if (!announcements.length) return null;

    return (
        <Stack spacing={0} sx={{ width: "100%" }}>
        {announcements.map((a) => (
            <AnnouncementBar
            key={a.key}
            severity={a.severity}
            message={a.message}
            action={a.action}
            storageKey={a.storageKey}
            />
        ))}
        </Stack>
    );
}