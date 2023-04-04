import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

const preview = {
  decorators: [
    (Story) => (
      <ChakraProvider resetCSS>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
