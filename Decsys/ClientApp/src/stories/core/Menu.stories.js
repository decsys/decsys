import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AngleRight, GlobeAmericas } from "styled-icons/fa-solid";
import { MenuItem, MenuRouterLink, DropdownMenu } from "components/core";

storiesOf("Common UI/Menu", module)
  .add("Empty", () => <DropdownMenu />)
  .add("1 item", () => (
    <DropdownMenu>
      <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
    </DropdownMenu>
  ))
  .add("Some mixed items", () => (
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
  ));
