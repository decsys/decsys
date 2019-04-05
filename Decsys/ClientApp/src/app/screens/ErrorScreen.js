import React from "react";
import AppBar from "../components/AppBar";
import { Container, FlexBox, EmptyState } from "../components/ui";

const ErrorScreen = ({ splash, message }) => (
  <>
    <AppBar brand="DECSYS" />
    <Container>
      <FlexBox mt={5}>
        <EmptyState message={message} splash={splash} />
      </FlexBox>
    </Container>
  </>
);

export default ErrorScreen;
