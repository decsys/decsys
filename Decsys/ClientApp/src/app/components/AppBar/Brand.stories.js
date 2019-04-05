import React from "react";
import { storiesOf } from "@storybook/react";
import Brand from "./Brand";

storiesOf("AppBar/Brand", module)
  .add("Dark background", () => <Brand variant="dark">Hello</Brand>)
  .add("Light background", () => <Brand variant="light">Hello</Brand>)
  .add("Alternative link", () => (
    <Brand href="/somewhere/else" variant="light">
      Hello
    </Brand>
  ));
