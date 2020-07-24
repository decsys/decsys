import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider, CSSReset, theme } from "@chakra-ui/core";

addDecorator((s) => (
  <>
    <ChakraProvider theme={theme}>
      <CSSReset />
      {s()}
    </ChakraProvider>
  </>
));

addDecorator(withKnobs({ escapeHTML: false }));
