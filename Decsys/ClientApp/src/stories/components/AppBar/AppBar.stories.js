import React from "react";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";
import withNavi from "stories/helpers/story-navi";
import AppBar, { AppBarLink } from "components/AppBar";

export default {
  title: "AppBar",
  component: AppBar,
  decorators: [withNavi(["/somewhere", "/link", "/anotherLink"])]
};

export const Basic = () => <AppBar />;

export const Brand = () => <AppBar variant="danger" brand="My Brand" />;

export const OneChild = () => (
  <AppBar>
    <AppBarLink href="/somewhere">Clicky time</AppBarLink>
  </AppBar>
);

export const Children = () => (
  <AppBar variant="#ffdddd">
    <AppBarLink href="/link">A link</AppBarLink>
    <AppBarLink href="/anotherLink">Another link</AppBarLink>
    <Button onClick={action("Button clicked")}>Button</Button>
  </AppBar>
);

export const BrandAndChildren = () => (
  <AppBar variant="info" brand="My Brand">
    <AppBarLink href="/link">A link</AppBarLink>
    <AppBarLink color="yellow" href="/anotherLink">
      A custom colored link
    </AppBarLink>
    <Button variant="secondary" onClick={action("Button clicked")}>
      Button
    </Button>
  </AppBar>
);
