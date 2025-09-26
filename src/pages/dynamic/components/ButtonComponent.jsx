import React from "react";
import Button from "@mui/material/Button";
import EditView from "../views/EditView.jsx";
import { Link as RouterLink } from "react-router-dom";

export default function ButtonComponent({
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
