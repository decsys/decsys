import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AppBarLink from "./AppBarLink";

storiesOf("AppBarLink", module)
  .addDecorator(StoryRouter())
  .add("default", () => <AppBarLink to="/nowhere">Hello</AppBarLink>);
