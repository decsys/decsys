import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Brand from "./Brand";

storiesOf("AppBarBrand", module)
  .addDecorator(StoryRouter())
  .add("default", () => <Brand>Hello</Brand>);
