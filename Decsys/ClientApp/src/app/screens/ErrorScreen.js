import React from "react";
import AppBar from "components/AppBar";
import { Container, FlexBox, EmptyState } from "components/ui";
import AboutLink from "components/AboutLink";

const ErrorScreen = ({ splash, message, callToAction }) => (
  <>
    <AppBar brand="DECSYS" brandLink="#">
      <AboutLink />
    </AppBar>
    <Container>
      <FlexBox mt={5}>
        <EmptyState
          message={message}
          splash={splash}
          callToAction={callToAction}
        />
      </FlexBox>
    </Container>
  </>
);

export default ErrorScreen;
