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
    edit = false,
    }) {
    const img = typeof image === "string" ? { src: image } : image;
    const contentAlign = align === "center" ? "center" : "left";

    const cardEl = (
        <Card
        variant={outlined ? "outlined" : undefined}
        elevation={outlined ? 0 : elevation ?? 1}
        sx={{ width: "100%", boxSizing: "border-box" }}
        >
        {img?.src && (
            <CardMedia
            component="img"
            image={img.src}
            alt={img.alt || ""}
            sx={{ height: img.height || 160, objectFit: "cover" }}
            />
        )}

        <CardContent sx={{ textAlign: contentAlign }}>
            {title && (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {title}
            </Typography>
            )}
            {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.25 }}>
                {subtitle}
            </Typography>
            )}
            {body && (
            <Typography variant="body2" sx={{ opacity: 0.95, mt: 1 }}>
                {body}
            </Typography>
            )}
        </CardContent>

        {!!actions.length && (
            <CardActions sx={{ justifyContent: contentAlign === "center" ? "center" : "flex-start", px: 2, pb: 2 }}>
            <Stack direction="row" spacing={1}>
                {actions.map(
                (
                    {
                    label = "Learn more",
                    to = "#",
                    variant, 
                    color = "primary",
                    size = "small",
                    },
                    i
                ) => (
                <Button
                    key={i}
                    component={to?.startsWith("http") ? "a" : RouterLink}
                    {...(to?.startsWith("http") ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to })}
                    variant={variant || actionVariant} // use item variant or fallback
                    color={color}
                    size={size}
                >
                    {label}
                </Button>
                ))}
            </Stack>
            </CardActions>
        )}
        </Card>
    );

  return <EditView edit={edit}>{cardEl}</EditView>;
}
