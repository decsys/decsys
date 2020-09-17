import { Page } from "components/core";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Stack,
} from "@chakra-ui/core";
import React from "react";
import { useAuth } from "auth/AuthContext";

const Registered = () => {
  const { login } = useAuth();
  return (
    <Page>
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
    </Page>
  );
};
export default Registered;
