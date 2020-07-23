import React, { StrictMode } from "react";
import { ChakraProvider, CSSReset, InitializeColorMode } from "@chakra-ui/core";
import theme from "themes";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <InitializeColorMode />
      {children}
    </ChakraProvider>
  </StrictMode>
);

export default AppWrapper;
