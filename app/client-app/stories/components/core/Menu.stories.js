import React from "react";
import { action } from "@storybook/addon-actions";
import { AngleRight, GlobeAmericas } from "styled-icons/fa-solid";
import { MenuItem, MenuRouterLink, DropdownMenu } from "components/core";

export default {
  title: "Core UI/Menu",
  component: DropdownMenu,
};

export const Basic = () => <DropdownMenu />;

export const SingleItem = () => (
  <DropdownMenu>
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
  </DropdownMenu>
);

export const SomeMixedItems = () => (
  <DropdownMenu>
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
    <MenuItem onClick={action("Goodbye clicked")}>
      <AngleRight size="1em" />
      Goodbye
    </MenuItem>
    <MenuRouterLink to="/somewhere">
      <GlobeAmericas size="1em" /> Go /somewhere
    </MenuRouterLink>
  </DropdownMenu>
);
