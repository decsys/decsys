import React from "react";
import { storiesOf } from "@storybook/react";
import AppBar from "./AppBar";
import AppBarLink from "./Link";
import { Button } from "@smooth-ui/core-sc";
import { action } from "@storybook/addon-actions";
import withNavi from "../../utils/story-navi";

storiesOf("AppBar", module)
  .addDecorator(withNavi(["/somewhere", "/link", "/anotherLink"]))
  .add("Default", () => <AppBar />)
  .add("Brand", () => <AppBar variant="danger" brand="My Brand" />)
  .add("One Child", () => (
    <AppBar>
      <AppBarLink href="/somewhere">Clicky time</AppBarLink>
    </AppBar>
  ))
  .add("Children", () => (
    <AppBar variant="#ffdddd">
      <AppBarLink href="/link">A link</AppBarLink>
      <AppBarLink href="/anotherLink">Another link</AppBarLink>
      <Button onClick={action("Button clicked")}>Button</Button>
    </AppBar>
  ))
  .add("Brand and Children", () => (
    <AppBar variant="info" brand="My Brand">
      <AppBarLink href="/link">A link</AppBarLink>
      <AppBarLink color="yellow" href="/anotherLink">
        A custom colored link
      </AppBarLink>
      <Button variant="secondary" onClick={action("Button clicked")}>
        Button
      </Button>
    </AppBar>
  ));
