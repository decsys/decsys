import { Page } from "components/core";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Stack,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import { useQueryStringViewModel } from "hooks/useQueryString";
import ErrorsAlert from "components/core/ErrorsAlert";
import DefaultContainer from "components/shared/DefaultContainer";
import { Router, navigate, useLocation } from "@reach/router";
import AccountApprovalFeedback from "./Approval";
import RegisterFeedback from "./Register";
import PasswordFeedback from "./Password";
import EmailFeedback from "./Email";
import { resendEmail } from "api/account";
import AccountResentComplete from "./Resent";

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

const LinkError = () => (
  <FeedbackAlert status="error" title="There was an error with the link.">
    The User ID or Code is invalid.
  </FeedbackAlert>
);

export const DefaultFeedback = () => {
  const { errors } = useQueryStringViewModel();

  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const pathSegments = location.pathname.split("/");

  let result = {
    errors: searchParams.get("errors")?.split(",") || [],
    category: pathSegments[3],
    state: pathSegments[4],
    userId: searchParams.get("userId"),
    code: searchParams.get("code"),
  };

  const handleResendApprovalEmail = async (userId) => {
    try {
      console.log(userId);
      await resendEmail(userId);
    } catch (error) {
      console.error("Failed to resend approval email:", error);
    }
  };

  // Errors?
  if (
    result.category !== "approval" &&
    result.state !== "tokenexpired" &&
    errors &&
    errors.length
  )
    return (
      <ErrorsAlert
        title="One or more errors occurred:"
        errors={errors}
        boxShadow="callout"
      />
    );

  if (result.category === "approval" && result.state === "tokenexpired") {
    return (
      <FeedbackAlert title="Token Expired" status="error">
        <Box>
          The approval token has expired. Please request a new approval email.
        </Box>
        <Button
          colorScheme="blue"
          mt={4}
          onClick={() => handleResendApprovalEmail(result.userId)}
        >
          Resend Approval Email
        </Button>
      </FeedbackAlert>
    );
  }

  // For everything else, there's generic success
  return (
    <Router>
      <LinkError path="linkerror" />
      <FeedbackAlert title="Success!" status="success" default>
        <Link color="blue.500" href="/">
          Return home
        </Link>
        .
      </FeedbackAlert>
    </Router>
  );
};

// This provides the page container
// then just routes to categories, or a default
const UserFeedback = () => (
  <Page>
    <DefaultContainer mt={4}>
      <Flex>
        <Router style={{ width: "100%" }}>
          <AccountApprovalFeedback path="approval/*" />
          <RegisterFeedback path="register/*" />
          <PasswordFeedback path="password/*" />
          <EmailFeedback path="email/*" />
          <AccountResentComplete path="approval/*" />
          <DefaultFeedback default />
        </Router>
      </Flex>
    </DefaultContainer>
  </Page>
);
export default UserFeedback;
