import React from "react";
import { Alert, AlertIcon, Stack, Text } from "@chakra-ui/core";
import TryThisAlert from "components/core/TryThisAlert";
import { Utf8ToBase64Url } from "services/data-structures";

export const EmailConfirmationRequired = ({ Email }) => (
  <TryThisAlert
    status="warning"
    text="That account requires confirmation."
    linkText="Resend confirmation link."
    href={`/account/confirm/resend/${Utf8ToBase64Url(Email)}`}
  />
);

export const ApprovalRequired = () => (
  <Alert status="warning">
    <AlertIcon />
    <Stack spacing={1} w="100%">
      <Text>That account is awaiting approval.</Text>
      <Text>You will be notified via email of the approval outcome.</Text>
    </Stack>
  </Alert>
);
