import React from "react";
import { storiesOf } from "@storybook/react";
import Param from "./Param";
import { types } from "../../../param-types";
import { text, boolean, optionsKnob } from "@storybook/addon-knobs";

const oneOf = ["Hello", "Goodbye", "Something else"];

storiesOf("Admin/ComponentEditor/Param", module)
  .add("Text", () => (
    <Param type={types.string} value={text("Value", "My Value")} />
  ))
  .add("Boolean", () => (
    <Param type={types.bool} value={boolean("Value", true)} />
  ))
  .add("oneOf", () => (
    <Param
      type={types.oneOf}
      value={optionsKnob("Value", oneOf, "Hello", { display: "inline-radio" })}
      oneOf={oneOf}
    />
  ));
