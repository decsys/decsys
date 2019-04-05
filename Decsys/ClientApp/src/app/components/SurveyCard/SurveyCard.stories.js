import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, number, text } from "@storybook/addon-knobs";
import SurveyCard from "./SurveyCard";
import { action } from "@storybook/addon-actions";
import withNavi from "../../utils/story-navi";
import SurveyCardContext from "./Context";
import {
  context as ManageSurveyButtonContext,
  basePath,
  naviPaths
} from "./ManageSurveyButton.stories";

const context = {
  ...ManageSurveyButtonContext,
  handleCloseClick: action("Close clicked"),
  handleLaunchClick: action("Launch clicked")
};

storiesOf("Admin/SurveyCard", module)
  .addDecorator(
    withNavi([...naviPaths, `${basePath}/results`, `${basePath}/dashboard`])
  )
  .addDecorator(s => (
    <SurveyCardContext.Provider value={context}>
      {s()}
    </SurveyCardContext.Provider>
  ))
  .add("Default", () => (
    <SurveyCard
      id={0}
      name={text("Name", "My Survey")}
      activeInstanceId={boolean("Active", false) ? 5 : null}
      runCount={number("Run Count", 0)}
      allowLaunch={boolean("Allow Launch", true)}
    />
  ));
