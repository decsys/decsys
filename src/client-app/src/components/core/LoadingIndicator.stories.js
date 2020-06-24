import React from "react";
import { text } from "@storybook/addon-knobs";
import LoadingIndicator from "./LoadingIndicator";

export default {
  title: "Core UI/LoadingIndicator",
  component: LoadingIndicator
};

export const Basic = () => (
  <LoadingIndicator
    verb={text("Verb", "Reticulating")}
    noun={text("Noun", "splines")}
  />
);
