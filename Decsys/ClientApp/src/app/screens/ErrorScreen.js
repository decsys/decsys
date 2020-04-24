import React from "react";
import { FlexBox, EmptyState } from "components/core";
import withLayout from "app/layouts/withLayout";

const ErrorScreen = ({ splash, message, callToAction }) => (
  <FlexBox mt={5}>
    <EmptyState message={message} splash={splash} callToAction={callToAction} />
  </FlexBox>
);

export default withLayout(ErrorScreen);
