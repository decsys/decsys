import React from "react";
import { storiesOf } from "@storybook/react";
import { text, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

const actions = {
  logResults: action("Results logged")
};

storiesOf("Component", module).add("Default", () => (
  <Component
    initialText={text("Text", "Hello")}
    maxLength={number("Max Length", 50)}
    {...actions}
  />
));
