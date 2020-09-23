import React from "react";
import { Router } from "@reach/router";
import { Stack, Text } from "@chakra-ui/core";
import { DefaultFeedback, FeedbackAlert } from "./index";
import { useQueryStringViewModel } from "hooks/useQueryString";

const PasswordResetLinkSent = () => (
  <FeedbackAlert title="Email Address Confirmation">
    <Stack spacing={2} align="center" w="100%">
      <Text>
        An password reset email has been sent to the registered email address.
      </Text>
      <Text>
        Please check your email, and click the link within to reset your
        password.
      </Text>
    </Stack>
  </FeedbackAlert>
);

const PasswordFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <PasswordResetLinkSent path="request" />
    </Router>
  );
};
export default PasswordFeedback;
