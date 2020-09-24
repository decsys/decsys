import { Link, Stack, Text } from "@chakra-ui/core";
import React from "react";
import { useAuth } from "auth/AuthContext";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { Router } from "@reach/router";
import { DefaultFeedback, FeedbackAlert } from ".";

const RegistrationComplete = () => {
  const { login } = useAuth();
  return (
    <FeedbackAlert title="Registration Complete!" status="success">
      You may now{" "}
      <Link color="blue.500" onClick={() => login({ returnUrl: "" })}>
        login to your account
      </Link>
      .
    </FeedbackAlert>
  );
};

const EmailConfirmationSent = () => (
  <FeedbackAlert title="Email Address Confirmation">
    <Stack spacing={2} align="center" w="100%">
      <Text>
        An confirmation email has been sent to the registered email address.
      </Text>
      <Text>
        Please check your email, and click the link within to confirm your email
        address.
      </Text>
    </Stack>
  </FeedbackAlert>
);

const AwaitingApproval = () => (
  <FeedbackAlert title="Awaiting Approval">
    <Stack spacing={2} align="center" w="100%">
      <Text>New accounts require approval.</Text>
      <Text>You will be notified via email of the approval outcome.</Text>
    </Stack>
  </FeedbackAlert>
);

const RegisterFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <EmailConfirmationSent path="confirmemail" />
      <AwaitingApproval path="approval" />
      <RegistrationComplete path="complete" />
      <DefaultFeedback default />
    </Router>
  );
};

export default RegisterFeedback;
