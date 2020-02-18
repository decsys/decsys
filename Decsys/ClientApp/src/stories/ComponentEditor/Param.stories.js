import React from "react";
import Param from "components/ComponentEditor/Param";
import { types } from "@decsys/param-types";
import { text, boolean, optionsKnob } from "@storybook/addon-knobs";

const oneOf = ["Hello", "Goodbye", "Something else"];

export default {
  title: "Admin/ComponentEditor/Param",
  component: Param
};

export const Text = () => (
  <Param type={types.string} value={text("Value", "My Value")} />
);

export const Boolean = () => (
  <Param type={types.bool} value={boolean("Value", true)} />
);

export const OneOf = () => (
  <Param
    type={types.oneOf}
    value={optionsKnob("Value", oneOf, "Hello", { display: "inline-radio" })}
    oneOf={oneOf}
  />
);
