import React from "react";
import { storiesOf } from "@storybook/react";
import { optionsKnob } from "@storybook/addon-knobs";
import ComponentRender from "./ComponentRender";
import PageHeading from "../page-items/Heading";
import PageParagraph from "../page-items/Paragraph";

// try and emulate things in the platform closely

// window.__DECSYS__.Components
export const components = {
  // obvs these would be response components,
  // but we don't keep those in this repo
  // so we'll use PageItems for now
  Heading: PageHeading,
  Paragraph: PageParagraph
};

export const paramsLookup = {
  Heading: {
    // from our app state for the current component
    params: {
      text: "Hello there",
      color: "red"
    }
  },
  Paragraph: {
    params: {
      text: "# I'm a heading \n and here's *some* **other** __text__.",
      alignText: "right"
    }
  }
};

export const knob = () =>
  optionsKnob("Component Type", ["Heading", "Paragraph"], "Heading", {
    display: "inline-radio"
  });

storiesOf("ComponentRender", module).add("Default", () => (
  <ComponentRender
    component={components[knob()]}
    params={paramsLookup[knob()].params}
  />
));
