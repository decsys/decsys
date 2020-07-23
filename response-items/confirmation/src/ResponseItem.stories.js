import React from "react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";

const actions = {
  setNextEnabled: action("Next Button toggled"),
  logEvent: action("Custom Event logged"),
  logResults: action("ResponseItem Results logged"),
};

export default {
  title: "Confirmation",
  component: ResponseItem,
};

export const Basic = () => (
  <ResponseItem
    label={text(
      ResponseItem.params.label.label,
      ResponseItem.params.label.defaultValue
    )}
    {...actions}
  />
);

export const intiallyChecked = () => (
  <ResponseItem
    label={text(
      ResponseItem.params.label.label,
      ResponseItem.params.label.defaultValue
    )}
    confirmed={true}
    {...actions}
  />
);
