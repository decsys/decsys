import React, { StrictMode } from "react";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CSSReset />
      {children}
    </ThemeProvider>
  </StrictMode>
);

export default AppWrapper;
