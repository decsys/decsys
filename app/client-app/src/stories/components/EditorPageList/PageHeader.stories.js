import React from "react";
import { action } from "@storybook/addon-actions";
import { number } from "@storybook/addon-knobs";
import PageHeader from "components/EditorPageList/PageHeader";

export const actions = {
  onRandomToggle: action("Random Toggle"),
  onHeadingClick: action("Add Heading clicked"),
  onParagraphClick: action("Add Paragraph clicked"),
  onImageClick: action("Add Image clicked"),
  onDuplicateClick: action("Duplicate clicked"),
  onDeleteClick: action("Delete clicked")
};

export default {
  title: "Admin/EditorPageList/PageHeader",
  component: PageHeader,
  includeStories: /^[A-Z]/
};

export const Basic = () => (
  <PageHeader
    n={number("Page Number", 1)}
    page={{}}
    provided={{}}
    actions={actions}
  />
);
