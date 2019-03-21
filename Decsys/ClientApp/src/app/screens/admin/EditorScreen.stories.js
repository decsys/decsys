import React from "react";
import { storiesOf } from "@storybook/react";
import { PureEditorScreen } from "./EditorScreen";
import { withBasicStore } from "../../utils/story-redux";
import { decorate } from "@storybook/addon-actions";

const state = {
  editor: {
    survey: { name: "My Survey" },
    updateStates: { name: {} }
  }
};

const actions = {
  onNameChange: decorate([([e]) => [e.target.value, e]]).action("Name changed")
};

storiesOf("Admin/EditorScreen", module)
  .addDecorator(withBasicStore(state))
  .add("Loading", () => <PureEditorScreen {...state.editor} {...actions} />)
  .add("Default", () => (
    <PureEditorScreen
      {...state.editor}
      components={[]}
      surveyLoaded={true}
      {...actions}
    />
  ));
