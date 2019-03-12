import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AppBar from ".";
import Link from "./Link";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";

storiesOf("AppBar", module)
  .addDecorator(StoryRouter())
  .add("default", () => <AppBar />)
  .add("Brand", () => <AppBar brand="My Brand" />)
  .add("Children", () => (
    <AppBar>
      <Link to="/link">A link</Link>
      <Link to="/anotherLink">Another link</Link>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ))
  .add("Brand and Children", () => (
    <AppBar brand="My Brand">
      <Link to="/link">A link</Link>
      <Link to="/anotherLink">Another link</Link>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ));
