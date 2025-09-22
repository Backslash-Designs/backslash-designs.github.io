import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";

const values = [
    {
        title: "Scalable",
        description:
        "From day one, architectures are designed to handle growth—traffic bursts, data volume, and evolving features—without costly rework.",
        Icon: QueryStatsIcon,
        href: "/about#scalable",
    },
    {
        title: "Reliable",
        description:
        "We build for uptime with redundancy, observability, and testing pipelines that keep changes safe and rollouts smooth.",
        Icon: VerifiedIcon,
        href: "/about#reliable",
    },
    {
        title: "Secure",
        description:
        "Security is built-in: least-privilege access, encryption standards, and continuous hardening—not bolted on later.",
        Icon: SecurityIcon,
        href: "/about#secure",
    },
];

export default function Values() {
    return (
        <Box component="section" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        <Box sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Our Values
            </Typography>
            <Grid container spacing={2} alignItems="stretch">
            {values.map(({ title, description, Icon, href }) => (
                <Grid key={title} item size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
                    <Stack spacing={1.25}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: (t) => t.palette.action.hover,
                        }}
                        >
                        <Icon fontSize="small" />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {title}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {description}
                    </Typography>
                    <Box>
                        <Button size="small" component="a" href={href}>
                        Learn more
                        </Button>
                    </Box>
                    </Stack>
                </Paper>
                </Grid>
            ))}
            </Grid>
        </Box>
        </Box>
    );
}
