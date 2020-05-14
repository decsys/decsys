import React from "react";
import AppBar, { AppBarLink } from "./components/AppBar";
import { Icon, Box, useColorMode, IconButton, DarkMode } from "@chakra-ui/core";
import { FaMoon, FaSun } from "react-icons/fa";

const Default = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <AppBar brand="DECSYS" brandLink="/admin">
        <AppBarLink href="http://www.lucidresearch.org/decsys.html" isExternal>
          About DECSYS{" "}
          <sup>
            <Icon name="external-link" />
          </sup>
        </AppBarLink>

        <DarkMode>
          <IconButton
            color="whiteAlpha.700"
            title={`${colorMode === "light" ? "Dark" : "Light"} mode`}
            onClick={toggleColorMode}
            icon={colorMode === "light" ? FaMoon : FaSun}
          />
        </DarkMode>
      </AppBar>
      {/*TODO: make responsive*/}
      <Box px={{ base: 2, xl: 0 }} w={{ xl: "1140px" }} mx="auto">
        {children}
      </Box>
    </>
  );
};

export default Default;
