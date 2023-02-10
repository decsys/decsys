import { EmptyState } from "components/core";
import { Flex } from "@chakra-ui/react";
import Default from "app/layouts/Default";

export const ErrorBody = ({ splash, message, callToAction }) => (
  <Flex mt={5}>
    <EmptyState message={message} splash={splash} callToAction={callToAction} />
  </Flex>
);

export const Error = ({ error, splash, message, callToAction }) => {
  if (error) console.error(error);

  return (
    <Default>
      <ErrorBody
        message={message}
        splash={splash}
        callToAction={callToAction}
      />
    </Default>
  );
};
