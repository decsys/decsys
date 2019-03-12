import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import DeleteSurveyModal from "../../app/admin/surveys/DeleteSurveyModal";

storiesOf("DeleteSurveyModal", module).add("Default", () => (
  <DeleteSurveyModal
    surveyName="My First Survey"
    modalOpened={true}
    deleteSurvey={action("Delete clicked")}
    closeModal={action("Modal closed")}
  />
));
