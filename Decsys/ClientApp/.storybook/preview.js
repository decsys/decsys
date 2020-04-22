import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { Normalize } from "@smooth-ui/core-sc";
import theme from "../src/themes";
import { ThemeProvider } from "styled-components";

addDecorator(s => (
  <>
    <Normalize />
    <ThemeProvider theme={theme}>{s()}</ThemeProvider>
  </>
));

addDecorator(withKnobs({ escapeHTML: false }));
