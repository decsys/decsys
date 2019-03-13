import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Link from "./Link";

storiesOf("AppBar/Link", module)
  .addDecorator(StoryRouter())
  .add("Dark background", () => (
    <Link to="/nowhere" variant="dark">
      Hello
    </Link>
  ))
  .add("Light background", () => (
    <Link to="/nowhere" variant="light">
      Hello
    </Link>
  ));
