import React from "react";
import { useColorMode, DarkMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { defaultColorMode } from "themes";

const ToggleColorModeButton = ({ isAlwaysDark }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const button = (
    <IconButton
      color="whiteAlpha.700"
      title={`${
        (colorMode || defaultColorMode) === "light" ? "Dark" : "Light"
      } mode`}
      onClick={toggleColorMode}
      icon={
        (colorMode || defaultColorMode) === "light" ? <FaMoon /> : <FaSun />
      }
    />
  );
  return isAlwaysDark ? <DarkMode>{button}</DarkMode> : button;
};

export default ToggleColorModeButton;
