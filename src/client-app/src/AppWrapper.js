import React, { StrictMode } from "react";
import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import theme from "themes";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        {children}
      </ColorModeProvider>
    </ThemeProvider>
  </StrictMode>
);

export default AppWrapper;
