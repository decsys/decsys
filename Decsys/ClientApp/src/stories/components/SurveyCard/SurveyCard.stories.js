import React from "react";
import { boolean, number, text } from "@storybook/addon-knobs";
import SurveyCard from "components/SurveyCard";
import { action } from "@storybook/addon-actions";
import withNavi from "stories/helpers/story-navi";
import SurveyCardContext from "components/SurveyCard/Context";
import {
  context as ManageSurveyButtonContext,
  basePath,
  naviPaths as ManageSurveyButtonNaviPaths
} from "./ManageSurveyButton.stories";

export const context = {
  ...ManageSurveyButtonContext,
  handleCloseClick: action("Close clicked"),
  handleLaunchClick: action("Launch clicked")
};

export const naviPaths = [
  ...ManageSurveyButtonNaviPaths,
  `${basePath}/results`,
  `${basePath}/dashboard`
];

export default {
  title: "Admin/SurveyCard",
  component: SurveyCard,
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

export const Basic = () => (
  <SurveyCard
    id={0}
    name={text("Name", "My Survey")}
    activeInstanceId={boolean("Active", false) ? 5 : null}
    runCount={number("Run Count", 0)}
    allowLaunch={boolean("Allow Launch", true)}
  />
);
