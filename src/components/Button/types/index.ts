import type { ReactNode } from "react";
import type { ButtonProps } from "@mui/material";

export interface CustomButtonProps extends ButtonProps {
  label: ReactNode;
  variant: "contained" | "outlined" | "text";
}
