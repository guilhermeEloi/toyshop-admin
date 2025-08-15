import { Button } from "@mui/material";

import type { CustomButtonProps } from "./types";

const CustomButton = ({
  label,
  variant,
  type = "button",
  ...rest
}: CustomButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      sx={{
        fontFamily: "Roboto, sans-serif",
        fontWeight: 600,
        borderRadius: "8px",
        textTransform: "none",
        paddingX: 3,
        paddingY: 1,
        backgroundColor: "#285896",
        color: "#ffffff",
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
