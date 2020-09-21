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

// This is a catch all for the results feedback from many User actions
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

const GeneralActionComplete = () => (
  <FeedbackAlert title="Success!" status="success">
    <Link color="blue.500" href="/">
      Return home
    </Link>
    .
  </FeedbackAlert>
);

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

const AccountApprovalContent = () => {
  const { accountState = {} } = useQueryStringViewModel();

  if (accountState.AccountApproved)
    return <AccountApprovalComplete isApproved />;
  if (accountState.AccountRejected) return <AccountApprovalComplete />;
  return <DefaultContent />;
};

const DefaultContent = () => {
  const { errors, accountState = {} } = useQueryStringViewModel();

  // Unlike on some forms, or for some sources, errors take precedence over `accountState`
  if (errors && errors.length)
    return (
      <ErrorsAlert
        title="One or more errors occurred:"
        errors={errors}
        boxShadow="callout"
      />
    );

  // TODO: probably should move these to their own source
  if (accountState.RequiresEmailConfirmation) return <EmailConfirmationSent />;
  if (accountState.RequiresApproval) return <AwaitingApproval />;
  if (accountState.RegistrationComplete) return <RegistrationComplete />;

  return <GeneralActionComplete />;
};

const UserFeedback = () => {
  const { source } = useQueryStringViewModel();

  return (
    <Page>
      <DefaultContainer mt={4}>
        <Flex>
          {(() => {
            switch (source) {
              case "AccountApproval":
                return <AccountApprovalContent />;
              default:
                return <DefaultContent />;
            }
          })()}
        </Flex>
      </DefaultContainer>
    </Page>
  );
};
export default UserFeedback;
