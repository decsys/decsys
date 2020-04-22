import React from "react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import SurveyConfigModal from "components/SurveyCard/SurveyConfigModal";
import SurveyCardContext from "components/SurveyCard/Context";

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

export default {
  title: "Admin/SurveyCard/SurveyConfigModal",
  component: SurveyConfigModal,
  decorators: [
    s => (
      <SurveyCardContext.Provider value={context}>
        {s()}
      </SurveyCardContext.Provider>
    )
  ],
  includeStories: /^[A-Z]/
};

export const Basic = () => (
  <SurveyConfigModal
    surveyName={text("Survey name", "My First Survey")}
    modalState={{
      modalOpened: true,
      toggleModal: action("Modal closed")
    }}
    saveConfig={action("Save clicked")}
  />
);
