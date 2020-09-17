import React from "react";
import AppBar, { AppBarLink } from "./AppBar";
import {
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  IconButton,
  DarkMode,
  Button,
} from "@chakra-ui/core";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BiHelpCircle } from "react-icons/bi";
import { Link } from "@reach/router";

const DefaultAppBar = ({ brandLink }) => {
  return (
    <AppBar brand="DECSYS" brandLink={brandLink}>
      {true && (
        <DarkMode>
          <Button as={Link} variant="ghost" to="/admin">
            Admin
          </Button>
        </DarkMode>
      )}

      <Menu>
        <DarkMode>
          <MenuButton as={IconButton} variant="ghost" icon={<BiHelpCircle />} />
        </DarkMode>
        <MenuList>
          <MenuItem as="a" href="/docs">
            Documentation
          </MenuItem>
          <MenuItem
            as="a"
            href="http://www.lucidresearch.org/decsys.html"
            target="_blank"
          >
            <Text>About DECSYS</Text>
            <sup>
              <Icon as={FaExternalLinkAlt} />
            </sup>
          </MenuItem>
        </MenuList>
      </Menu>
    </AppBar>
  );
};
DefaultAppBar.defaultProps = { brandLink: "/admin" };

export default DefaultAppBar;
