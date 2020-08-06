import React from "react";
import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import themes from "themes";

addDecorator((s) => (
  <>
    <ChakraProvider theme={themes}>
      <CSSReset />
      {s()}
    </ChakraProvider>
  </>
));

addDecorator(withKnobs({ escapeHTML: false }));
