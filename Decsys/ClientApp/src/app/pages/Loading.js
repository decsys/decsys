import React from "react";
import LoadingIndicator from "components/core/LoadingIndicator";
import Layout from "app/layouts/Default";
import { Flex } from "@chakra-ui/core";

const Loading = () => (
  <Layout>
    <Flex justify="center">
      <Flex bg="gray.100" borderColor="gray.300" borderWidth={1} mt={10}>
        <LoadingIndicator />
      </Flex>
    </Flex>
  </Layout>
);

export default Loading;
