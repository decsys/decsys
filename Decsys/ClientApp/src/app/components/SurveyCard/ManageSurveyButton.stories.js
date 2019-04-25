import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean } from "@storybook/addon-knobs";
import ManageSurveyButton from "./ManageSurveyButton";
import { action } from "@storybook/addon-actions";
import withNavi from "../../utils/story-navi";
import SurveyCardContext from "./Context";

export const context = {
  handleEditClick: action("Edit clicked"),
  handleDuplicateClick: action("Duplicate clicked"),
  handleDeleteClick: action("Delete clicked"),
  handleSurveyConfigSaveClick: action("Save clicked"),
  fetchSurveyConfig: () =>
    new Promise(resolve =>
      resolve({
        oneTimeParticipants: false,
        useParticipantIdentifiers: true,
        validIdentifiers: ["hello", "there"]
      })
    )
};

export const basePath = "/admin/survey/:id";
export const naviPaths = [`${basePath}/preview`, `${basePath}/export`];

storiesOf("Admin/SurveyCard/ManageSurveyButton", module)
  .addDecorator(withNavi(naviPaths))
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Default", () => (
    <ManageSurveyButton
      id={0}
      name={text("Survey name", "My First Survey")}
      editable={boolean("Is Survey Editable", false)}
    />
  ));
