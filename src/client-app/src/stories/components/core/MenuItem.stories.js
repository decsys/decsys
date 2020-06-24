import React from "react";
import { action } from "@storybook/addon-actions";
import { AngleRight, GlobeAmericas } from "styled-icons/fa-solid";
import withNavi from "stories/helpers/story-navi";
import { MenuItem, MenuRouterLink } from "components/core";

export default {
  title: "Core UI/MenuItem",
  component: MenuItem,
  decorators: [withNavi(["/somewhere"])]
};

export const Text = () => (
  <MenuItem onClick={action("Hello clicked")}>Hello</MenuItem>
);

export const IconAndText = () => (
  <MenuItem onClick={action("Hello clicked")}>
    <AngleRight size="1em" />
    Hello
  </MenuItem>
);

export const WithRouterLink = () => (
  <MenuRouterLink href="/somewhere">
    <GlobeAmericas size="1em" /> Go /somewhere
  </MenuRouterLink>
);
