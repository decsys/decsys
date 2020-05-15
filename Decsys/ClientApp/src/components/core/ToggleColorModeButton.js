import React from "react";
import { useColorMode, DarkMode, IconButton } from "@chakra-ui/core";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleColorModeButton = ({ isAlwaysDark }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const button = (
    <IconButton
      color="whiteAlpha.700"
      title={`${colorMode === "light" ? "Dark" : "Light"} mode`}
      onClick={toggleColorMode}
      icon={colorMode === "light" ? FaMoon : FaSun}
    />
  );
  return isAlwaysDark ? <DarkMode>{button}</DarkMode> : button;
};

export default ToggleColorModeButton;
