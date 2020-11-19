import React from "react";
import { Container } from "@chakra-ui/react";

const DefaultContainer = ({ children, ...p }) => {
  return (
    // TODO: make responsive
    <Container
      px={{ base: 2, xl: 0 }}
      maxWidth={{ base: "100%", xl: "1140px" }}
      mx="auto"
      {...p}
    >
      {children}
    </Container>
  );
};

export default DefaultContainer;
