import React from "react";
import { FlexBox, EmptyState, Page } from "components/core";

const ErrorScreen = ({ splash, message, callToAction }) => (
  <Page>
    <FlexBox mt={5}>
      <EmptyState
        message={message}
        splash={splash}
        callToAction={callToAction}
      />
    </FlexBox>
  </Page>
);

export default ErrorScreen;
