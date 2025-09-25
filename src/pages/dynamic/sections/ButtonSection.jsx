import React from "react";
import Button from "@mui/material/Button";
import EditView from "../views/EditView.jsx";
import { Link as RouterLink } from "react-router-dom";

/**
 * ButtonSection
 * JSON props:
 * - label (string): visible text
 * - to (string): route path
 * - variant (string): MUI variant (contained | outlined | text) default 'contained'
 * - color (string): MUI color (primary | secondary | etc) default 'primary'
 * - size (string): small | medium | large
 * - fullWidth (boolean): stretch to container width
 * - edit (boolean): toggle edit affordances
 */
export default function ButtonSection({
  label = "Click",
  to = "/",
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  edit = false,
}) {
  const btn = (
    <Button
      component={RouterLink}
      to={to}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      sx={{ fontWeight: 600 }}
    >
      {label}
    </Button>
  );
  return <EditView edit={edit}>{btn}</EditView>;
}
