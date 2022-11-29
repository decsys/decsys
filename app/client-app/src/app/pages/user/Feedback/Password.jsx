import { Router } from "@reach/router";
import { Stack, Text, Link } from "@chakra-ui/react";
import { DefaultFeedback, FeedbackAlert } from "./index";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { useAuth } from "auth/AuthContext";

const PasswordResetLinkSent = () => (
  <FeedbackAlert title="Password Reset Link Sent">
    <Stack spacing={2} align="center" w="100%">
      <Text>
        A password reset email has been sent to the registered email address.
      </Text>
      <Text>
        Please check your email, and click the link within to reset your
        password.
      </Text>
    </Stack>
  </FeedbackAlert>
);

const PasswordResetSuccess = () => {
  const { login } = useAuth();
  return (
    <FeedbackAlert title="Password Changed" status="success">
      <Stack spacing={2} align="center" w="100%">
        <Text>Your password has been successfully changed.</Text>
        <Text>
          You may now{" "}
          <Link color="blue.500" onClick={() => login({ returnUrl: "" })}>
            login to your account
          </Link>
          .
        </Text>
      </Stack>
    </FeedbackAlert>
  );
};

const PasswordFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <PasswordResetLinkSent path="request" />
      <PasswordResetSuccess path="reset" />
    </Router>
  );
};
export default PasswordFeedback;
