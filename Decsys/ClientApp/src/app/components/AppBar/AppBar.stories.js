import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AppBar from "./AppBar";
import AppBarLink from "./AppBarLink";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";

storiesOf("AppBar", module)
  .addDecorator(StoryRouter())
  .add("default", () => <AppBar />)
  .add("Brand", () => <AppBar brand="My Brand" />)
  .add("Children", () => (
    <AppBar>
      <AppBarLink to="/link">A link</AppBarLink>
      <AppBarLink to="/anotherLink">Another link</AppBarLink>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ))
  .add("Brand and Children", () => (
    <AppBar brand="My Brand">
      <AppBarLink to="/link">A link</AppBarLink>
      <AppBarLink to="/anotherLink">Another link</AppBarLink>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ));
