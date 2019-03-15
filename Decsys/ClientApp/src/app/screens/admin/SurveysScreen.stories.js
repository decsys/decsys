import React from "react";
import { storiesOf } from "@storybook/react";
import SurveysScreen from "./SurveysScreen";
import { surveyListProps } from "../../components/SurveyList/SurveyList.stories";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import { withBasicStore } from "../../utils/story-redux";

const store = {
  surveyList: {
    filtered: surveyListProps.filtered,
    sorted: surveyListProps.sorted,
    sortState: surveyListProps.sortState
  }
};

const { surveys } = surveyListProps;

storiesOf("Admin/SurveysScreen", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore(store))
  .add("Default", () => (
    <SurveysScreen onCreateClick={action("Create Survey clicked")} />
  ))
  .add("Surveys", () => (
    <SurveysScreen
      surveys={surveys}
      onCreateClick={action("Create Survey clicked")}
    />
  ));
