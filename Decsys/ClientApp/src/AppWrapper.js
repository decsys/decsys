import React, { StrictMode } from "react";
import {
  ThemeProvider,
  CSSReset,
  theme,
  ColorModeProvider
} from "@chakra-ui/core";

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
