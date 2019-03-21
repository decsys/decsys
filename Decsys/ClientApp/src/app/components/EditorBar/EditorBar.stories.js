import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import EditorBar from "./EditorBar";
import { withBasicStore } from "../../utils/story-redux";

const actions = {
  onPreviewClick: action("Preview clicked"),
  onDuplicateClick: action("Duplicate clicked"),
  onExportClick: action("Export clicked"),
  onDeleteClick: action("Delete clicked")
};

const state = {
  surveyEditor: {
    survey: { name: "Untitled Survey" }
  }
};

storiesOf("Admin/EditorBar", module)
  .addDecorator(withBasicStore(state))
  .add("Default", () => <EditorBar {...actions} name="My Survey" />);
