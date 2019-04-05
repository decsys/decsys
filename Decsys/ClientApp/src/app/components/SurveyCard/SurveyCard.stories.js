import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, number, text } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { PureSurveyCard } from "./SurveyCard";
import { action } from "@storybook/addon-actions";
import { withBasicStore } from "../../utils/story-redux";

storiesOf("Admin/SurveyCard", module).add("Default", () => (
  <PureSurveyCard
    id={0}
    name={text("Name", "My Survey")}
    activeInstanceId={boolean("Active", false) ? 5 : null}
    runCount={number("Run Count", 0)}
    allowLaunch={boolean("Allow Launch", true)}
    onCloseClick={action("Close clicked")}
    onLaunchClick={action("Launch clicked")}
  />
));
