import React from "react"; // eslint-disable-line no-unused-vars
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const Root = ({ children }) => {
  return (
    <ChakraProvider
      resetCSS={false}
      theme={extendTheme({
        components: {},
        styles: {
          global: {
            body: {
              bg: "inherit",
            },
          },
        },
      })}
    >
      {children}
    </ChakraProvider>
  );
};

export default Root;
