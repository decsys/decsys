import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { Normalize } from "@smooth-ui/core-sc";
import theme from "../src/themes";

addDecorator(s => (
  <>
    <Normalize />
    {s()}
  </>
));

addDecorator(withThemesProvider([theme]));

addDecorator(withKnobs({ escapeHTML: false }));
