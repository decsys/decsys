import React from "react";
import { storiesOf } from "@storybook/react";
import { PureSurveysScreen } from "./SurveysScreen";
import { surveyListProps } from "../../components/SurveyList/SurveyList.stories";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import { withBasicStore } from "../../utils/story-redux";

const store = {
  surveys: {
    filtered: surveyListProps.filtered,
    sorted: surveyListProps.sorted,
    sortState: surveyListProps.sortState
  }
};

const { surveys } = surveyListProps;

const actions = {
  onFetchSurveys: action("Fetched Surveys from API"),
  onCreateClick: action("Create Survey clicked")
};

storiesOf("Admin/SurveysScreen", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore(store))
  .add("Loading", () => <PureSurveysScreen {...actions} />)
  .add("Empty", () => <PureSurveysScreen {...actions} listLoaded />)
  .add("Surveys", () => <PureSurveysScreen surveys={surveys} {...actions} />)
  .add("No Active Survey", () => (
    <PureSurveysScreen
      {...actions}
      surveys={Object.keys(surveys).reduce((acc, id) => {
        acc[id] = {
          ...surveys[id],
          activeInstanceId: null
        };
        return acc;
      }, {})}
    />
  ));
