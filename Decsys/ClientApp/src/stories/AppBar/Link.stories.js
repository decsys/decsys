import React from "react";
import withNavi from "stories/helpers/story-navi";
import { AppBarLink } from "components/AppBar";

export default {
  title: "AppBar/Link",
  component: AppBarLink,

  decorators: [withNavi(["/nowhere"])]
};

export const DarkBackground = () => (
  <AppBarLink href="/nowhere" variant="dark">
    Hello
  </AppBarLink>
);

export const LightBackground = () => (
  <AppBarLink href="/nowhere" variant="light">
    Hello
  </AppBarLink>
);
