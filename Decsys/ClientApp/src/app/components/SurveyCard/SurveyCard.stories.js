import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, number, text } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import SurveyCard from "./SurveyCard";
import { action } from "@storybook/addon-actions";
import { withBasicStore } from "../../utils/story-redux";

storiesOf("Admin/SurveyCard", module)
  .addDecorator(StoryRouter())
  .addDecorator(withBasicStore())
  .add("Default", () => (
    <SurveyCard
      id={0}
      name={text("Name", "My Survey")}
      active={boolean("Active", false)}
      runCount={number("Run Count", 0)}
      allowLaunch={boolean("Allow Launch", true)}
      onCloseClick={action("Close clicked")}
      onLaunchClick={action("Launch clicked")}
    />
  ));
