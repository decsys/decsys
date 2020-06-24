import React from "react";
import withNavi from "stories/helpers/story-navi";
import PureEditorScreen from "app/screens/admin/EditorScreen/PureEditorScreen";
import EditorBarContext from "components/EditorBar/Context";
import { decorate, action } from "@storybook/addon-actions";
import { components } from "stories/components/EditorPageList/PageComponent.stories";
import { actions as pageListActions } from "stories/components/EditorPageList/EditorPageList.stories";
import { pages } from "stories/components/EditorPageList/Page.stories";

const survey = { name: "My Survey", pages: pages };

const actions = {
  handleNameChange: decorate([([e]) => [e.target.value, e]]).action(
    "Name changed"
  ),
  handleDeleteClick: action("Delete confirmed"),
  handleDuplicateClick: action("Duplicate clicked"),
  pageListActions
};

export default {
  title: "Screens/Admin/EditorScreen",
  component: PureEditorScreen,
  decorators: [
    withNavi(["/", "/admin/survey/:id/preview"]),
    s => (
      <EditorBarContext.Provider value={{ ...actions, pageListActions: null }}>
        {s()}
      </EditorBarContext.Provider>
    )
  ]
};

export const Basic = () => (
  <PureEditorScreen
    id={0}
    survey={{ ...survey, pages: [] }}
    components={components}
    {...actions}
  />
);

export const withPages = () => (
  <PureEditorScreen
    id={0}
    survey={survey}
    components={components}
    {...actions}
  />
);
