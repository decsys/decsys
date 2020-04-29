import React from "react";
import AppBar, { AppBarLink } from "./components/AppBar";
import { Icon, Box } from "@chakra-ui/core";

const Default = ({ children }) => (
  <>
    <AppBar brand="DECSYS" brandLink="">
      <AppBarLink href="http://www.lucidresearch.org/decsys.html" isExternal>
        About DECSYS{" "}
        <sup>
          <Icon name="external-link" />
        </sup>
      </AppBarLink>
    </AppBar>
    <Box w="1140px" mx="auto">
      {children}
    </Box>
  </>
);

export default Default;
