import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { number } from "@storybook/addon-knobs";
import PageHeader from "./PageHeader";

export const actions = {
  onRandomToggle: action("Random Toggle"),
  onHeadingClick: action("Add Heading clicked"),
  onParagraphClick: action("Add Paragraph clicked"),
  onImageClick: action("Add Image clicked"),
  onDuplicateClick: action("Duplicate clicked"),
  onDeleteClick: action("Delete clicked")
};

storiesOf("Admin/EditorPageList/PageHeader", module).add("Default", () => (
  <PageHeader n={number("Page Number", 1)} {...actions} />
));
