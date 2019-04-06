import React from "react";
import { storiesOf } from "@storybook/react";
import withNavi from "../../utils/story-navi";
import SurveyCardContext from "../../components/SurveyCard/Context";
import { surveys } from "../../components/SurveyList/SurveyList.stories";
import {
  naviPaths,
  context
} from "../../components/SurveyCard/SurveyCard.stories";
import SurveysScreen from "./SurveysScreen";

// flatten this, since that's how we get it from the api
const surveyList = Object.keys(surveys).map(id => surveys[id]);
const inactiveSurveyList = surveyList.map(x => ({
  ...x,
  activeInstanceId: null
}));

storiesOf("Admin/SurveysScreen", module)
  .addDecorator(withNavi(naviPaths))
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Empty", () => <SurveysScreen />)
  .add("Surveys", () => <SurveysScreen surveys={surveyList} />)
  .add("No Active Survey", () => (
    <SurveysScreen surveys={inactiveSurveyList} />
  ));
