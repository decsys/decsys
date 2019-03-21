import React from "react";
import { storiesOf } from "@storybook/react";
import { PureEditorScreen } from "./EditorScreen";
import { withBasicStore } from "../../utils/story-redux";

const state = {
  surveyEditor: {
    survey: { name: "Hello" }
  }
};

storiesOf("Admin/EditorScreen", module)
  .addDecorator(withBasicStore(state))
  .add("Loading", () => <PureEditorScreen survey={state.surveyEditor.survey} />)
  .add("Default", () => (
    <PureEditorScreen
      surveyLoaded={true}
      survey={{ name: "Hello" }}
      components={[]}
    />
  ));
