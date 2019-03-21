import React from "react";
import StoryRouter from "storybook-react-router";
import { storiesOf } from "@storybook/react";
import { PureEditorScreen } from "./EditorScreen";
import { withBasicStore } from "../../utils/story-redux";
import { decorate, action } from "@storybook/addon-actions";

const state = {
  editor: {
    survey: { name: "My Survey" },
    updateStates: { name: {} }
  }
};

const actions = {
  onNameChange: decorate([([e]) => [e.target.value, e]]).action("Name changed"),
  onDeleteClick: action("Delete confirmed"),
  onDuplicateClick: action("Duplicate clicked")
};

storiesOf("Admin/EditorScreen", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore(state))
  .add("Loading", () => (
    <PureEditorScreen id={0} {...state.editor} {...actions} />
  ))
  .add("Default", () => (
    <PureEditorScreen
      id={0}
      {...state.editor}
      components={[]}
      surveyLoaded={true}
      {...actions}
    />
  ));
