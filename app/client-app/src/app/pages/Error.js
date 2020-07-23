import React from "react";
import { EmptyState, Page } from "components/core";
import { Flex } from "@chakra-ui/core";

const Error = ({ splash, message, callToAction }) => (
  <Page>
    <Flex mt={5}>
      <EmptyState
        message={message}
        splash={splash}
        callToAction={callToAction}
      />
    </Flex>
  </Page>
);

export default Error;
