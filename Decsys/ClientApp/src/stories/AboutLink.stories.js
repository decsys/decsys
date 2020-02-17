import React from "react";
import withNavi from "stories/util/story-navi";
import AboutLink from "components/AboutLink";

export default {
  title: "AboutLink",
  component: AboutLink,
  decorators: [withNavi(["/nowhere"])]
};

export const Basic = () => <AboutLink />;
