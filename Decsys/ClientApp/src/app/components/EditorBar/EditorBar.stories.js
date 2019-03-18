import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import EditorBar from "./EditorBar";

const actions = {
  onPreviewClick: action("Preview clicked"),
  onDuplicateClick: action("Duplicate clicked"),
  onExportClick: action("Export clicked"),
  onDeleteClick: action("Delete clicked")
};

storiesOf("Admin/EditorBar", module).add("Default", () => (
  <EditorBar {...actions} name="My Survey" />
));
