import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Brand from "./Brand";

storiesOf("AppBar/Brand", module)
  .addDecorator(StoryRouter())
  .add("Dark background", () => <Brand variant="dark">Hello</Brand>)
  .add("Light background", () => <Brand variant="light">Hello</Brand>);
