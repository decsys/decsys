import React, { StrictMode } from "react";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import theme from "themes";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <Normalize />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StrictMode>
);

export default AppWrapper;
