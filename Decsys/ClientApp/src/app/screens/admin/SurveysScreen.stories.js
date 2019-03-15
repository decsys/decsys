import React from "react";
import { storiesOf } from "@storybook/react";
import SurveysScreen from "./SurveysScreen";
import { surveyListProps } from "../../components/SurveyList/SurveyList.stories";
import { action } from "@storybook/addon-actions";

storiesOf("Admin/SurveysScreen", module).add("Default", () => (
  <SurveysScreen onCreateClick={action("Create Survey clicked")} />
));
