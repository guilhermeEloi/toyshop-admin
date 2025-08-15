import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { InputProps } from "./types";

const Input = ({
  label,
  name,
  value,
  onChange,
  variant,
  required,
  disabled,
  length,
  error,
  helperText,
  type,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isPassword = type === "password";

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      required={required}
      variant={variant}
      margin="normal"
      disabled={disabled}
      error={error}
      helperText={helperText}
      type={isPassword && !showPassword ? "password" : "text"}
      inputProps={{
        maxLength: length || undefined,
      }}
      InputProps={{
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton onClick={handleTogglePassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default Input;
