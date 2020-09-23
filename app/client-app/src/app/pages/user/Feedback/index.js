import { Page } from "components/core";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Stack,
  Flex,
} from "@chakra-ui/core";
import React from "react";
import { useQueryStringViewModel } from "hooks/useQueryString";
import ErrorsAlert from "components/core/ErrorsAlert";
import DefaultContainer from "components/shared/DefaultContainer";
import { Router } from "@reach/router";
import AccountApprovalFeedback from "./Approval";
import RegisterFeedback from "./Register";
import PasswordFeedback from "./Password";

export const FeedbackAlert = ({ title, children, ...p }) => (
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

export const DefaultFeedback = () => {
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
