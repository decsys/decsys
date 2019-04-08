import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { AngleRight, GlobeAmericas } from "styled-icons/fa-solid";
import MenuItem from "./MenuItem";
import MenuRouterLink from "./MenuRouterLink";
import withNavi from "../../utils/story-navi";

storiesOf("Common UI/MenuItem", module)
  .addDecorator(withNavi(["/somewhere"]))
  .add("Text", () => (
    <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
  ))
  .add("Icon and Text", () => (
    <MenuItem onClick={action("Hello clicked")}>
      <AngleRight size="1em" />
      Hello
    </MenuItem>
  ))
  .add("MenuRouterLink", () => (
    <MenuRouterLink href="/somewhere">
      <GlobeAmericas size="1em" /> Go /somewhere
    </MenuRouterLink>
  ));
