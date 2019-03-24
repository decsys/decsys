import React from "react";
import { storiesOf } from "@storybook/react";
import { text, number, optionsKnob } from "@storybook/addon-knobs";
import Paragraph from "./Paragraph";

const getLabel = param => Paragraph.params[param].label;
const getDefault = param => Paragraph.params[param].defaultValue;
const getEnum = param => Paragraph.params[param].oneOf;

const options = { display: "inline-radio" };

storiesOf("Page Components/Paragraph", module).add("Default", () => (
  <Paragraph
    text={text(getLabel("text"), getDefault("text"))}
    color={text(getLabel("color"), getDefault("color"))}
    textAlign={optionsKnob(
      getLabel("textAlign"),
      getEnum("textAlign"),
      getDefault("textAlign"),
      options
    )}
    fontFamily={text(getLabel("fontFamily"), undefined)}
  />
));
