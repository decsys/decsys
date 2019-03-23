import React from "react";
import StoryRouter from "storybook-react-router";
import { storiesOf } from "@storybook/react";
import { PureEditorScreen } from "./EditorScreen";
import { withBasicStore } from "../../utils/story-redux";
import { decorate, action } from "@storybook/addon-actions";
import { components } from "../../components/EditorPageList/PageComponent.stories";
import { actions as pageListActions } from "../../components/EditorPageList/EditorPageList.stories";
import { pages } from "../../components/EditorPageList/Page.stories";

const state = {
  editor: {
    survey: { name: "My Survey", pages: pages },
    updateStates: { name: {} }
  }
};

const actions = {
  onNameChange: decorate([([e]) => [e.target.value, e]]).action("Name changed"),
  onDeleteClick: action("Delete confirmed"),
  onDuplicateClick: action("Duplicate clicked"),
  pageListActions
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
      {...{ ...state.editor, survey: { ...state.editor.survey, pages: [] } }}
      components={components}
      surveyLoaded={true}
      {...actions}
    />
  ))
  .add("Pages", () => (
    <PureEditorScreen
      id={0}
      {...state.editor}
      components={components}
      surveyLoaded={true}
      {...actions}
    />
  ));
