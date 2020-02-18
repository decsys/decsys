import React from "react";
import { action, decorate } from "@storybook/addon-actions";
import withNavi from "stories/util/story-navi";
import EditorBar, { EditorBarContext } from "components/EditorBar";

const context = {
  handleDuplicateClick: action("Duplicate clicked"),
  handleDeleteClick: action("Delete clicked"),
  handleNameChange: decorate([([e]) => [e.target.value, e]]).action(
    "Name changed"
  ),
  nameUpdateState: {}
};

export default {
  title: "Admin/EditorBar",
  component: EditorBar,
  decorators: [
    withNavi(["/admin/survey/:id/preview", "/admin/survey/:id/export", "/"]),
    s => (
      <EditorBarContext.Provider value={context}>
        {s()}
      </EditorBarContext.Provider>
    )
  ]
};

export const Basic = () => <EditorBar name="My Survey" />;
