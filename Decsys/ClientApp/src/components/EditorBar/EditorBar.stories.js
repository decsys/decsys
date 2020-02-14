import React from "react";
import { storiesOf } from "@storybook/react";
import { action, decorate } from "@storybook/addon-actions";
import withNavi from "../../utils/story-navi";
import EditorBar from "./EditorBar";
import EditorBarContext from "./Context";

const context = {
  handleDuplicateClick: action("Duplicate clicked"),
  handleDeleteClick: action("Delete clicked"),
  handleNameChange: decorate([([e]) => [e.target.value, e]]).action(
    "Name changed"
  ),
  nameUpdateState: {}
};

storiesOf("Admin/EditorBar", module)
  .addDecorator(
    withNavi(["/admin/survey/:id/preview", "/admin/survey/:id/export", "/"])
  )
  .addDecorator(s => (
    <EditorBarContext.Provider value={context}>{s()}</EditorBarContext.Provider>
  ))
  .add("Default", () => <EditorBar name="My Survey" />);
