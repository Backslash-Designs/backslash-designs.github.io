import React from "react";
import Box from "@mui/material/Box";

/**
 * Props:
 * - edit: boolean (show border if true)
 * - children: ReactNode
 */
export default function EditView({ edit = false, children }) {
    return edit ? (
        <Box sx={{ border: '2px dotted #888', borderRadius: 1, p: 2, width: '100%' }}>
            {children}
        </Box>
    ) : (
        <>{children}</>
    );
}
