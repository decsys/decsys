import React from "react"; // eslint-disable-line no-unused-vars
import { ChakraProvider } from "@chakra-ui/react";

const Root = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

export default Root;
