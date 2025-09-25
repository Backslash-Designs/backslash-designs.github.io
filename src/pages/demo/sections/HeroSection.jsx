import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function HeroSection({ title, subtitle }) {
    return (
        <Paper
            sx={{
                px: { xs: 2, sm: 3 },
                py: 4,
                borderRadius: 0,
                width: '100%',
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                boxSizing: 'border-box',
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Paper>
    );
}
