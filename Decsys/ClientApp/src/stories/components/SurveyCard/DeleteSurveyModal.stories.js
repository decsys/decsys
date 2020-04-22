import React from "react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import DeleteSurveyModal from "components/SurveyCard/DeleteSurveyModal";

export default {
  title: "Admin/SurveyCard/DeleteSurveyModal",
  component: DeleteSurveyModal
};

export const Basic = () => (
  <DeleteSurveyModal
    surveyName={text("Survey name", "My First Survey")}
    modalState={{
      modalOpened: true,
      toggleModal: action("Modal closed")
    }}
    deleteSurvey={action("Delete clicked")}
  />
);
