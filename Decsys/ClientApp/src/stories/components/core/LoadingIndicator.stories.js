import React from "react";
import { text } from "@storybook/addon-knobs";
import { LoadingIndicator } from "components/core";

export default {
  title: "Core UI/LoadingIndicator",
  component: LoadingIndicator
};

export const Basic = () => (
  <LoadingIndicator verb={text("Verb", "Loading")} noun={text("Noun", "")} />
);
