import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";

addDecorator(s => (
  <>
    <ThemeProvider theme={theme}>
      <CSSReset />
      {s()}
    </ThemeProvider>
  </>
));

addDecorator(withKnobs({ escapeHTML: false }));
