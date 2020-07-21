import React from "react";
import AppBar, { AppBarLink } from "./components/AppBar";
import { Icon, Box } from "@chakra-ui/core";
import ToggleColorModeButton from "components/core/ToggleColorModeButton";
import { FaExternalLinkAlt } from "react-icons/fa";

const Default = ({ children }) => {
  return (
    <>
      <AppBar brand="DECSYS" brandLink="/admin">
        <AppBarLink href="http://www.lucidresearch.org/decsys.html" isExternal>
          About DECSYS{" "}
          <sup>
            <Icon as={FaExternalLinkAlt} />
          </sup>
        </AppBarLink>

        <ToggleColorModeButton isAlwaysDark />
      </AppBar>
      {/*TODO: make responsive*/}
      <Box px={{ base: 2, xl: 0 }} w={{ xl: "1140px" }} mx="auto">
        {children}
      </Box>
    </>
  );
};

export default Default;
