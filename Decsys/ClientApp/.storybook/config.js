import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { withThemes } from "storybook-styled-components";
import { Normalize } from "@smooth-ui/core-sc";
import theme from "../src/themes";

addDecorator(story => (
  <>
    <Normalize />
    {story()}
  </>
));
addDecorator(withThemes({ Default: theme }));

configure(() => require("../src/stories"), module);
