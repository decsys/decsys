import React from "react";
import { optionsKnob, text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import PageItem from "components/EditorPageList/PageItem";

const options = {
  Heading: "heading",
  Paragraph: "paragraph",
  Image: "image",
};

const actions = {
  onDeleteClick: action("Delete clicked"),
  onDuplicateClick: action("Duplicate clicked"),
};

export default {
  title: "Admin/EditorPageList/PageItem",
  component: PageItem,
};

export const Basic = () => (
  <PageItem
    type={optionsKnob("Type", options, "heading", { display: "inline-radio" })}
    params={{ text: text("Preview text", "Heading") }}
    provided={{}}
    {...actions}
  />
);
