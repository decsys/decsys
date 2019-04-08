import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import withNavi from "../../../utils/story-navi";
import SurveyCardContext from "../../../components/SurveyCard/Context";
import { surveys } from "../../../components/SurveyList/SurveyList.stories";
import {
  naviPaths,
  context as surveyCardContext
} from "../../../components/SurveyCard/SurveyCard.stories";
import PureSurveysScreen from "./PureSurveysScreen";

const inactiveSurveys = Object.keys(surveys).reduce((acc, id) => {
  acc[id] = {
    ...surveys[id],
    activeInstanceId: null
  };
  return acc;
}, {});

const actions = {
  onCreateClick: action("Create Button clicked")
};

storiesOf("Admin/SurveysScreen", module)
  .addDecorator(withNavi(naviPaths))
  .addDecorator(s => (
    <SurveyCardContext.Provider value={surveyCardContext}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Empty", () => <PureSurveysScreen {...actions} />)
  .add("Surveys", () => <PureSurveysScreen surveys={surveys} {...actions} />)
  .add("No Active Survey", () => (
    <PureSurveysScreen surveys={inactiveSurveys} {...actions} />
  ));
