import React from "react";
import withNavi from "stories/util/story-navi";
import Brand from "components/AppBar/Brand";

export default {
  title: "AppBar/Brand",
  component: Brand,
  decorators: [withNavi(["/", "/somewhere/else"])]
};

export const DarkBackground = () => <Brand variant="dark">Hello</Brand>;

export const LightBackground = () => <Brand variant="light">Hello</Brand>;

export const AlternativeLink = () => (
  <Brand href="/somewhere/else" variant="light">
    Hello
  </Brand>
);
