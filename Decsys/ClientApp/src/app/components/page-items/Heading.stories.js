import React from "react";
import { storiesOf } from "@storybook/react";
import { text, number, optionsKnob } from "@storybook/addon-knobs";
import Heading from "./Heading";

const getLabel = param => Heading.params[param].label;
const getDefault = param => Heading.params[param].defaultValue;
const getEnum = param => Heading.params[param].oneOf;

const options = { display: "inline-radio" };

storiesOf("Page Components/Heading", module).add("Default", () => (
  <Heading
    text={text(getLabel("text"), getDefault("text"))}
    xMargin={number(getLabel("xMargin"), getDefault("xMargin"))}
    color={text(getLabel("color"), getDefault("color"))}
    variant={optionsKnob(
      getLabel("variant"),
      getEnum("variant"),
      getDefault("variant"),
      options
    )}
    textAlign={optionsKnob(
      getLabel("textAlign"),
      getEnum("textAlign"),
      getDefault("textAlign"),
      options
    )}
    fontFamily={text(getLabel("fontFamily"), undefined)}
  />
));
