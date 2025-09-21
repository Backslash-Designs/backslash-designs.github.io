import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AnnouncementBar from "./AnnouncementBar";

/**
 * Computes which system-wide announcements to show.
 * Add new ones by pushing into the `announcements` array.
 */
export default function SystemAnnouncements() {
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

    //Example: planned maintenance (dismiss persists)
    // announcements.push({
    //     key: "planned-maintenance-2025-09-30",
    //     severity: "info",
    //     message: "Planned maintenance Sept 30, 9–10 PM ET.",
    //     storageKey: "maint-2025-09-30"
    // });

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
