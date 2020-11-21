import { EmptyState } from "components/core";
import { Flex } from "@chakra-ui/react";
import Default from "app/layouts/Default";

const Error = ({ error, splash, message, callToAction }) => {
  if (error) console.error(error);

  return (
    <Default>
      <Flex mt={5}>
        <EmptyState
          message={message}
          splash={splash}
          callToAction={callToAction}
        />
      </Flex>
    </Default>
  );
};

export default Error;
