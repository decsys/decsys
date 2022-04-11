import { ChakraProvider } from "@chakra-ui/react";

export const Wrapper: React.FC = ({ children }) => (
  <ChakraProvider>
    <div className="wrapped">{children}</div>
  </ChakraProvider>
);
