import { useState, useContext } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { ThemeSwitch } from "@/components/ThemeSwitch";
import { ColorModeContext } from "@/contexts/ThemeContext";

import { NavLeft, ToggleButton } from "./styles";
import Sidebar from "@/components/Sidebar";

export default function NavBar() {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        style={{ backgroundColor: mode === "light" ? "#F0F0F0" : "#1D1B26" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <NavLeft>
            <ToggleButton onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon
                style={{
                  color: mode === "light" ? "#1c2230" : "#ffffff",
                  fontSize: "32px",
                }}
              />
            </ToggleButton>
          </NavLeft>
          <ThemeSwitch checked={mode === "dark"} onChange={toggleColorMode} />
        </Toolbar>
      </AppBar>

      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
