import React from "react";
import withNavi from "../../../utils/story-navi";
import { storiesOf } from "@storybook/react";
import PureEditorScreen from "./PureEditorScreen";
import EditorBarContext from "../../../components/EditorBar/Context";
import { decorate, action } from "@storybook/addon-actions";
import { components } from "../../../components/EditorPageList/PageComponent.stories";
import { actions as pageListActions } from "../../../components/EditorPageList/EditorPageList.stories";
import { pages } from "../../../components/EditorPageList/Page.stories";

const survey = { name: "My Survey", pages: pages };

const actions = {
  handleNameChange: decorate([([e]) => [e.target.value, e]]).action(
    "Name changed"
  ),
  handleDeleteClick: action("Delete confirmed"),
  handleDuplicateClick: action("Duplicate clicked"),
  pageListActions
};

storiesOf("Admin/EditorScreen", module)
  .addDecorator(
    withNavi(["/", "/admin/survey/:id/preview", "/admin/survey/:id/export"])
  )
  .addDecorator(s => (
    <EditorBarContext.Provider value={{ ...actions, pageListActions: null }}>
      {s()}
    </EditorBarContext.Provider>
  ))
  .add("Default", () => (
    <PureEditorScreen
      id={0}
      survey={{ ...survey, pages: [] }}
      components={components}
      {...actions}
    />
  ))
  .add("Pages", () => (
    <PureEditorScreen
      id={0}
      survey={survey}
      components={components}
      {...actions}
    />
  ));
