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

const RegistrationComplete = () => {
  const { login } = useAuth();
  return (
    <Alert boxShadow="callout" mt={4} status="success" borderRadius={5} p={4}>
      <Stack spacing={2} align="center" w="100%">
        <div>
          <AlertIcon boxSize="40px" />
        </div>
        <AlertTitle>Registration Complete!</AlertTitle>
        <AlertDescription>
          You may now{" "}
          <Link color="blue.500" onClick={() => login({ returnUrl: "" })}>
            login to your account
          </Link>
          .
        </AlertDescription>
      </Stack>
    </Alert>
  );
};

const EmailConfirmationSent = () => (
  <Alert boxShadow="callout" status="info" borderRadius={5} p={4}>
    <Stack spacing={2} align="center" w="100%">
      <div>
        <AlertIcon boxSize="40px" />
      </div>
      <AlertTitle>Email Address Confirmation</AlertTitle>
      <AlertDescription>
        <Stack spacing={2} align="center" w="100%">
          <Text>
            An confirmation email has been sent to the registered email address.
          </Text>
          <Text>
            Please check your email, and click the link within to confirm your
            email address.
          </Text>
        </Stack>
      </AlertDescription>
    </Stack>
  </Alert>
);

const AwaitingApproval = () => {
  <Alert boxShadow="callout" status="info" borderRadius={5} p={4}>
    <Stack spacing={2} align="center" w="100%">
      <div>
        <AlertIcon boxSize="40px" />
      </div>
      <AlertTitle>Awaiting Approval</AlertTitle>
      <AlertDescription>
        <Stack spacing={2} align="center" w="100%">
          <Text>New accounts require approval.</Text>
          <Text>You will be notified via email of the approval outcome.</Text>
        </Stack>
      </AlertDescription>
    </Stack>
  </Alert>;
};

const UserFeedback = () => {
  const { errors, accountState = {} } = useQueryStringViewModel();
  // Unlike on some forms, errors take precedence over `accountState`

  let content;
  if (errors && errors.length)
    content = (
      <ErrorsAlert
        title="One or more errors occurred:"
        errors={errors}
        boxShadow="callout"
      />
    );
  else if (accountState.RequiresEmailConfirmation)
    content = <EmailConfirmationSent />;
  else if (accountState.RequiresApproval) content = <AwaitingApproval />;
  else content = <RegistrationComplete />;

  return (
    <Page>
      <DefaultContainer mt={4}>
        <Flex>{content}</Flex>
      </DefaultContainer>
    </Page>
  );
};
export default UserFeedback;
