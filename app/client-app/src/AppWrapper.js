import React, { StrictMode } from "react";
import { ChakraProvider } from "@chakra-ui/core";
import theme from "themes";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <ChakraProvider resetCSS portalZIndex={999} theme={theme}>
      {children}
    </ChakraProvider>
  </StrictMode>
);

export default AppWrapper;
