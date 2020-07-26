import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";

addDecorator((s) => (
  <>
    <ChakraProvider theme={theme}>
      <CSSReset />
      {s()}
    </ChakraProvider>
  </>
));

addDecorator(withKnobs());
