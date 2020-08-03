import React from "react";
import AppBar, { AppBarLink } from "./AppBar";
import { Icon } from "@chakra-ui/core";
import { FaExternalLinkAlt } from "react-icons/fa";

const DefaultAppBar = ({ brandLink }) => (
  <AppBar brand="DECSYS" brandLink={brandLink}>
    <AppBarLink href="http://www.lucidresearch.org/decsys.html" isExternal>
      About DECSYS{" "}
      <sup>
        <Icon as={FaExternalLinkAlt} />
      </sup>
    </AppBarLink>
  </AppBar>
);
DefaultAppBar.defaultProps = { brandLink: "/admin" };

export default DefaultAppBar;
