import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditView from "../views/EditView.jsx";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

// + add: safe, statically-imported icon map (extend as needed)
import VideocamIcon from "@mui/icons-material/Videocam";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

const ICONS = {
    Videocam: VideocamIcon,
    LocalHospital: LocalHospitalIcon,
    VolunteerActivism: VolunteerActivismIcon,
    DesignServices: DesignServicesIcon,
    SupportAgent: SupportAgentIcon,
    Security: SecurityIcon,
    Verified: VerifiedIcon,
    QueryStats: QueryStatsIcon,
};

export default function CardComponent({
    title,
    subtitle,
    body,
    image,           // string | { src, alt, height }
    actions = [],    // [{ label, to, variant, color, size }]
    outlined, // outlined card by default
    elevation,       // optional elevation when not outlined
    align = "left",  // "left" | "center"
    actionVariant = "text", // default action button style (was implicitly "outlined")
    // + add icon props
    iconName,          // e.g., "Videocam" (see ICONS map)
    iconSize = "small",
    iconColor = "inherit",
    showIconBg = true, // render subtle circular bg behind icon
    edit = false,
}) {
    const img = typeof image === "string" ? { src: image } : image;
    const contentAlign = align === "center" ? "center" : "left";
    const IconComp = iconName && ICONS[iconName] ? ICONS[iconName] : null;

    const cardEl = (
        <Card
            variant={outlined ? "outlined" : undefined}
            elevation={outlined ? 0 : elevation ?? 1}
            sx={{ width: "100%", boxSizing: "border-box" }}
        >
            {/* Centered icon above header when align === 'center' */}
            {contentAlign === "center" && IconComp && (
                <Box sx={{ pt: 2, display: "flex", justifyContent: "center" }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: (t) => (showIconBg ? t.palette.action.hover : "transparent"),
                        }}
                    >
                        <IconComp fontSize={iconSize} htmlColor={iconColor === "inherit" ? undefined : iconColor} />
                    </Box>
                </Box>
            )}

            {/* Header holds title + subtitle */}
            <CardHeader
                avatar={
                    contentAlign !== "center" && IconComp ? (
                        <Avatar
                            sx={{
                                bgcolor: (t) => (showIconBg ? t.palette.action.hover : "transparent"),
                                color: "inherit",
                            }}
                        >
                            <IconComp fontSize="small" />
                        </Avatar>
                    ) : undefined
                }
                title={
                    title ? (
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                ...(contentAlign === "center" ? { textAlign: "center", width: "100%" } : null),
                            }}
                        >
                            {title}
                        </Typography>
                    ) : null
                }
                subheader={
                    subtitle ? (
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.9,
                                mt: 0.25,
                                ...(contentAlign === "center" ? { textAlign: "center", width: "100%" } : null),
                            }}
                        >
                            {subtitle}
                        </Typography>
                    ) : null
                }
                sx={{
                    py: 1.5,
                    ...(contentAlign === "center" ? { textAlign: "center", ".MuiCardHeader-content": { width: "100%" } } : null),
                }}
            />

            {/* Move media after header */}
            {img?.src && (
                <CardMedia
                    component="img"
                    image={img.src}
                    alt={img.alt || ""}
                    sx={{ height: img.height || 160, objectFit: "cover" }}
                />
            )}

            <CardContent sx={{ textAlign: contentAlign }}>
                {/* Title & subtitle moved to CardHeader; keep only body here */}
                {body && (
                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                        {body}
                    </Typography>
                )}
            </CardContent>

            {!!actions.length && (
                <CardActions
                    sx={{
                        justifyContent: contentAlign === "center" ? "center" : "flex-start",
                        px: 2,
                        pb: 2,
                    }}
                >
                    <Stack direction="row" spacing={1}>
                        {actions.map(
                            ({ label = "Learn more", to = "#", variant, color = "primary", size = "small" }, i) => (
                                <Button
                                    key={i}
                                    component={to?.startsWith("http") ? "a" : RouterLink}
                                    {...(to?.startsWith("http")
                                        ? { href: to, target: "_blank", rel: "noopener noreferrer" }
                                        : { to })}
                                    variant={variant || actionVariant}
                                    color={color}
                                    size={size}
                                >
                                    {label}
                                </Button>
                            )
                        )}
                    </Stack>
                </CardActions>
            )}
        </Card>
    );

    return <EditView edit={edit}>{cardEl}</EditView>;
}
