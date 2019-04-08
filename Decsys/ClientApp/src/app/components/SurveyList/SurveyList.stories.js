import React from "react";
import { storiesOf } from "@storybook/react";
import SurveyList from "./SurveyList";
import withNavi from "../../utils/story-navi";
import { naviPaths, context } from "../SurveyCard/SurveyCard.stories";
import SurveyCardContext from "../SurveyCard/Context";

export const surveys = {
  1: { id: 1, name: "A Survey 1", runCount: 7 },
  2: { id: 2, name: "C Survey 2", runCount: 0 },
  3: { id: 3, name: "B Survey 3", activeInstanceId: 7, runCount: 1 }
};

storiesOf("Admin/SurveyList", module)
  .addDecorator(withNavi(naviPaths))
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Default", () => <SurveyList surveys={surveys} />)
  .add("No Active Survey", () => (
    <SurveyList
      surveys={{
        ...surveys,
        3: { ...surveys[3], activeInstanceId: null }
      }}
    />
  ));
