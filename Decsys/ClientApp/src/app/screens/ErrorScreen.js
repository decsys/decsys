import React from "react";
import AppBar from "../components/AppBar";
import { Container, FlexBox, EmptyState } from "../components/ui";

const ErrorScreen = ({ splash, message, callToAction }) => (
  <>
    <AppBar brand="DECSYS" />
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
