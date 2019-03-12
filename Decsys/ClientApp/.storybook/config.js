import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { withThemes } from "storybook-styled-components";
import { Normalize } from "@smooth-ui/core-sc";
import theme from "../src/app/themes";

addDecorator(story => (
  <>
    <Normalize />
    {story()}
  </>
));
addDecorator(withThemes({ Default: theme }));

const req = require.context("../src", true, /.stories.js$/);

configure(() => req.keys().forEach(filename => req(filename)), module);
