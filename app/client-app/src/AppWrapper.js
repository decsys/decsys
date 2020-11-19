import { StrictMode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "themes";

const AppWrapper = ({ children }) => (
  <StrictMode>
    <ChakraProvider resetCSS portalZIndex={theme.zIndices.portal} theme={theme}>
      {children}
    </ChakraProvider>
  </StrictMode>
);

export default AppWrapper;
