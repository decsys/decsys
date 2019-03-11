import React from "react";
import { storiesOf } from "@storybook/react";
import { ToggleSurveyActiveButton } from "../../app/admin/surveys/ToggleSurveyActiveButton";
import { action } from "@storybook/addon-actions";

storiesOf("ToggleSurveyActiveButton", module)
  .add("Inactive", () => (
    <ToggleSurveyActiveButton onClick={action("Launch Survey clicked")} />
  ))
  .add("Active", () => (
    <ToggleSurveyActiveButton active onClick={action("Close Survey clicked")} />
  ));
