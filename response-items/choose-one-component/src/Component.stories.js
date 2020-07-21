import React from "react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

export default {
  title: "Component",
  component: Component
};

const actions = {
  logResults: action("Results logged"),
  setNextEnabled: action("Next button enabled")
};

export const Basic = () => (
  <Component text={text("Text", "Hello")} {...actions} />
);
