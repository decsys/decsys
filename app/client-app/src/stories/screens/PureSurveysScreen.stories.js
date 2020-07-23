import React from "react";
import { action } from "@storybook/addon-actions";
import withNavi from "stories/helpers/story-navi";
import SurveyCardContext from "components/SurveyCard/Context";
import { surveys } from "stories/components/SurveyList/SurveyList.stories";
import {
  naviPaths,
  context as surveyCardContext
} from "stories/components/SurveyCard/SurveyCard.stories";
import PureSurveysScreen from "app/screens/admin/SurveysScreen/PureSurveysScreen";

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

export default {
  title: "Screens/Admin/SurveysScreen",
  component: PureSurveysScreen,
  decorators: [
    withNavi(naviPaths),
    s => (
      <SurveyCardContext.Provider value={surveyCardContext}>
        {s()}
      </SurveyCardContext.Provider>
    )
  ]
};

export const Basic = () => <PureSurveysScreen {...actions} />;

export const withSurveys = () => (
  <PureSurveysScreen surveys={surveys} {...actions} />
);

export const noActiveSurveys = () => (
  <PureSurveysScreen surveys={inactiveSurveys} {...actions} />
);
