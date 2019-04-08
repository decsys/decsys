import React from "react";
import { storiesOf } from "@storybook/react";
import { text, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import FreeText from "./index";

const actions = {
  logResults: action("Results logged")
};

storiesOf("FreeText", module).add("Default", () => (
  <FreeText
    initialText={text("Text", "Hello")}
    maxLength={number("Max Length", 50)}
    {...actions}
  />
));
