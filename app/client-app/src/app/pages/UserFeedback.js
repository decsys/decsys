import { Page } from "components/core";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/core";
import React from "react";
import { useAuth } from "auth/AuthContext";
import { useQueryStringViewModel } from "hooks/useQueryString";
import ErrorsAlert from "components/core/ErrorsAlert";
import DefaultContainer from "components/shared/DefaultContainer";
import { Router } from "@reach/router";

const FeedbackAlert = ({ title, children, ...p }) => (
  <Alert status="info" boxShadow="callout" mt={4} borderRadius={5} p={4} {...p}>
    <Stack spacing={2} align="center" w="100%">
      <div>
        <AlertIcon boxSize="40px" />
      </div>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Stack>
  </Alert>
);

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

const AwaitingApproval = () => (
  <FeedbackAlert title="Awaiting Approval">
    <Stack spacing={2} align="center" w="100%">
      <Text>New accounts require approval.</Text>
      <Text>You will be notified via email of the approval outcome.</Text>
    </Stack>
  </FeedbackAlert>
);

const AccountApprovalComplete = ({ isApproved }) => {
  const { Email } = useQueryStringViewModel();
  return (
    <FeedbackAlert
      status={isApproved ? "success" : "warning"}
      title={`Account ${isApproved ? "Approved" : "Rejected"}`}
    >
      Account <strong>{Email}</strong> has been{" "}
      {isApproved ? "approved" : "rejected"}.
    </FeedbackAlert>
  );
};

// Approval Category
const AccountApprovalFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <AccountApprovalComplete isApproved path="approved" />
      <AccountApprovalComplete path="rejected" />
      <DefaultFeedback default />
    </Router>
  );
};

// Register Category
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

const PasswordFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <PasswordResetLinkSent path="request" />
    </Router>
  );
};

const DefaultFeedback = () => {
  const { errors } = useQueryStringViewModel();

  // Errors?
  if (errors && errors.length)
    return (
      <ErrorsAlert
        title="One or more errors occurred:"
        errors={errors}
        boxShadow="callout"
      />
    );

  // No errors? General success.
  return (
    <FeedbackAlert title="Success!" status="success">
      <Link color="blue.500" href="/">
        Return home
      </Link>
      .
    </FeedbackAlert>
  );
};

// This provides the page container
// then just routes to categories, or a default
const UserFeedback = () => (
  <Page>
    <DefaultContainer mt={4}>
      <Flex>
        <Router>
          <AccountApprovalFeedback path="approval/*" />
          <RegisterFeedback path="register/*" />
          <PasswordFeedback path="password/*" />
          <DefaultFeedback default />
        </Router>
      </Flex>
    </DefaultContainer>
  </Page>
);
export default UserFeedback;
