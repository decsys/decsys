import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Component from "./Component";

const actions = {
  setNextEnabled: action("Next Button toggled"),
  logEvent: action("Custom Event logged"),
  logResults: action("Component Results logged")
};

storiesOf("Component", module)
  .add("Default", () => (
    <Component
      label={text(
        Component.params.label.label,
        Component.params.label.defaultValue
      )}
      initialChecked={false}
      {...actions}
    />
  ))
  .add("Initially Checked", () => (
    <Component
      label={text(
        Component.params.label.label,
        Component.params.label.defaultValue
      )}
      initialChecked={true}
      {...actions}
    />
  ));
