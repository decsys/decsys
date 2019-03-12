import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import AppBarBrand from "./AppBarBrand";

storiesOf("AppBarBrand", module)
  .addDecorator(StoryRouter())
  .add("default", () => <AppBarBrand>Hello</AppBarBrand>);
