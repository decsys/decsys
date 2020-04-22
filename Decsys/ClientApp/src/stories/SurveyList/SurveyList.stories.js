import React from "react";
import SurveyList from "components/SurveyList";
import withNavi from "stories/util/story-navi";
import { naviPaths, context } from "../SurveyCard/SurveyCard.stories";
import SurveyCardContext from "components/SurveyCard/Context";

export const surveys = {
  1: { id: 1, name: "A Survey 1", runCount: 7 },
  2: { id: 2, name: "C Survey 2", runCount: 0 },
  3: { id: 3, name: "B Survey 3", activeInstanceId: 7, runCount: 1 }
};

export default {
  title: "Admin/SurveyList",
  component: SurveyList,
  decorators: [
    withNavi(naviPaths),
    s => (
      <SurveyCardContext.Provider value={context}>
        {s()}
      </SurveyCardContext.Provider>
    )
  ],
  includeStories: /^[A-Z]/
};

export const Basic = () => <SurveyList surveys={surveys} />;

export const NoActiveSurvey = () => (
  <SurveyList
    surveys={{
      ...surveys,
      3: { ...surveys[3], activeInstanceId: null }
    }}
  />
);
