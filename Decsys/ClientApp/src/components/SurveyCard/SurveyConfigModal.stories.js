import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import SurveyConfigModal from "./SurveyConfigModal";
import SurveyCardContext from "./Context";

export const context = {
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

storiesOf("Admin/SurveyCard/SurveyConfigModal", module)
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Default", () => (
    <SurveyConfigModal
      surveyName={text("Survey name", "My First Survey")}
      modalState={{
        modalOpened: true,
        toggleModal: action("Modal closed")
      }}
      saveConfig={action("Save clicked")}
    />
  ));
