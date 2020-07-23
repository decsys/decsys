import React from "react";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";
import AppBar, { AppBarLink } from "./AppBar";

export default {
  title: "AppBar",
  component: AppBar
};

export const Basic = () => <AppBar />;

export const Brand = () => <AppBar brand="My Brand" />;

export const OneChild = () => (
  <AppBar>
    <AppBarLink onClick={action("Link clicked")}>Clicky time</AppBarLink>
  </AppBar>
);

export const Children = () => (
  <AppBar>
    <AppBarLink onClick={action("Link clicked")}>A link</AppBarLink>
    <AppBarLink onClick={action("Another Link clicked")}>
      Another link
    </AppBarLink>
    <Button onClick={action("Button clicked")}>Button</Button>
  </AppBar>
);

export const BrandAndChildren = () => (
  <AppBar brand="My Brand">
    <AppBarLink onClick={action("Link clicked")}>A link</AppBarLink>
    <AppBarLink color="yellow.500" onClick={action("Another Link clicked")}>
      A custom colored link
    </AppBarLink>
    <Button variant="secondary" onClick={action("Button clicked")}>
      Button
    </Button>
  </AppBar>
);
