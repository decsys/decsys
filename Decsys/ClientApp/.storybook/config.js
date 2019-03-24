import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { withThemes } from "storybook-styled-components";
import { withKnobs } from "@storybook/addon-knobs";
import { Normalize } from "@smooth-ui/core-sc";
import theme from "../src/app/themes";

addDecorator(story => (
  <>
    <Normalize />
    {story()}
  </>
));

addDecorator(withThemes({ Default: theme }));

addDecorator(
  withKnobs({
    escapeHTML: false
  })
);

const req = require.context("../src", true, /.stories.js$/);

configure(() => req.keys().forEach(filename => req(filename)), module);
