import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import { AngleRight, GlobeAmericas } from "styled-icons/fa-solid";
import MenuItem from "./MenuItem";
import MenuRouterLink from "./MenuRouterLink";

storiesOf("MenuItem", module)
  .add("Text", () => (
    <MenuItem onClick={action("Button clicked")}>Hello</MenuItem>
  ))
  .add("Icon and Text", () => (
    <MenuItem onClick={action("Button clicked")}>
      <AngleRight size="1em" />
      Hello
    </MenuItem>
  ))
  .addDecorator(StoryRouter())
  .add("MenuRouterLink", () => (
    <MenuRouterLink to="/somewhere">
      <GlobeAmericas size="1em" /> Go /somewhere
    </MenuRouterLink>
  ));
