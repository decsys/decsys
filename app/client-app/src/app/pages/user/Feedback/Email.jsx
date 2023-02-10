import { Router } from "@reach/router";
import { Stack, Text, Link } from "@chakra-ui/react";
import { DefaultFeedback, FeedbackAlert } from "./index";
import { useQueryStringViewModel } from "hooks/useQueryString";
import { useAuth } from "auth/AuthContext";

const EmailChangeSuccess = () => {
  const { login } = useAuth();
  return (
    <FeedbackAlert title="Email Address Changed" status="success">
      <Stack spacing={2} align="center" w="100%">
        <Text>Your email address has been successfully changed.</Text>
        <Text>
          You may now{" "}
          <Link color="blue.500" onClick={() => login({ returnUrl: "" })}>
            login to your account
          </Link>{" "}
          using the new email address.
        </Text>
      </Stack>
    </FeedbackAlert>
  );
};

const EmailFeedback = () => {
  const { errors } = useQueryStringViewModel();
  if (errors && errors.length) return <DefaultFeedback />;

  return (
    <Router>
      <EmailChangeSuccess path="changed" />
    </Router>
  );
};
export default EmailFeedback;
