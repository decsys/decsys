import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AppBar from "./AppBar";
import AppBarLink from "./Link";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";

storiesOf("AppBar", module)
  .addDecorator(StoryRouter())
  .add("Default", () => <AppBar />)
  .add("Brand", () => <AppBar variant="danger" brand="My Brand" />)
  .add("One Child", () => (
    <AppBar>
      <AppBarLink to="/somewhere">Clicky time</AppBarLink>
    </AppBar>
  ))
  .add("Children", () => (
    <AppBar variant="#ffdddd">
      <AppBarLink to="/link">A link</AppBarLink>
      <AppBarLink to="/anotherLink">Another link</AppBarLink>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ))
  .add("Brand and Children", () => (
    <AppBar variant="info" brand="My Brand">
      <AppBarLink to="/link">A link</AppBarLink>
      <AppBarLink color="yellow" to="/anotherLink">
        A custom colored link
      </AppBarLink>
      <Button variant="secondary" onClick={action("Button clicked")}>
        Button
      </Button>
    </AppBar>
  ));
