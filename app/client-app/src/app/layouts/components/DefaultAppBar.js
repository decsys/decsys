import React from "react";
import AppBar, { AppBarLink } from "./AppBar";
import { Icon } from "@chakra-ui/core";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "@reach/router";

const DefaultAppBar = ({ brandLink }) => (
  <AppBar brand="DECSYS" brandLink={brandLink}>
    <AppBarLink as={Link} to="/docs">
      Documentation
    </AppBarLink>
    <AppBarLink as={Link} to="/admin">
      Admin
    </AppBarLink>
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
