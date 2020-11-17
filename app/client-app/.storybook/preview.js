import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "themes";

addDecorator((s) => (
  <ChakraProvider resetCss theme={theme}>
    {s()}
  </ChakraProvider>
));

addDecorator(withKnobs({ escapeHTML: false }));
