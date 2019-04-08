import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import Confirm from "./index";

const actions = {
  setNextEnabled: action("Next Button toggled"),
  logEvent: action("Custom Event logged"),
  logResults: action("Component Results logged")
};

storiesOf("Confirm", module)
  .add("Default", () => (
    <Confirm
      label={text(
        Confirm.params.label.label,
        Confirm.params.label.defaultValue
      )}
      initialChecked={false}
      {...actions}
    />
  ))
  .add("Initially Checked", () => (
    <Confirm
      label={text(
        Confirm.params.label.label,
        Confirm.params.label.defaultValue
      )}
      initialChecked={true}
      {...actions}
    />
  ));
