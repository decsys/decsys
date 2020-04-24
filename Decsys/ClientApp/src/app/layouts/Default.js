import React from "react";
import AppBar from "components/AppBar";
import AboutLink from "components/AboutLink";
import Container from "components/core/Container";

const Default = ({ children }) => (
  <>
    <AppBar brand="DECSYS" brandLink="#">
      <AboutLink />
    </AppBar>
    <Container>{children}</Container>
  </>
);

export default Default;
