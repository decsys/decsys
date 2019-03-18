import React from "react";
import { storiesOf } from "@storybook/react";
import { PureSurveysScreen } from "./SurveysScreen";
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

const onCreateClick = action("Create Survey clicked");

storiesOf("Admin/SurveysScreen", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore(store))
  .add("Default", () => <PureSurveysScreen onCreateClick={onCreateClick} />)
  .add("Surveys", () => (
    <PureSurveysScreen surveys={surveys} onCreateClick={onCreateClick} />
  ))
  .add("No Active Survey", () => (
    <PureSurveysScreen
      surveys={Object.keys(surveys).reduce((acc, id) => {
        acc[id] = {
          ...surveys[id],
          active: false
        };
        return acc;
      }, {})}
      onCreateClick={onCreateClick}
    />
  ));
