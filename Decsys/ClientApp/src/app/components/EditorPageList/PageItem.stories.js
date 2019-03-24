import React from "react";
import { storiesOf } from "@storybook/react";
import { optionsKnob, text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import PageItem from "./PageItem";

const options = {
  Heading: "heading",
  Paragraph: "paragraph",
  Image: "image"
};

const actions = {
  onDeleteClick: action("Delete clicked"),
  onDuplicateClick: action("Duplicate clicked")
};

storiesOf("Admin/EditorPageList/PageItem", module).add("Default", () => (
  <PageItem
    type={optionsKnob("Type", options, "heading", { display: "inline-radio" })}
    text={text("Preview text", "Heading")}
    {...actions}
  />
));
