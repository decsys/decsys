import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import PageLayout from "../components/PageLayout";
import { Flex, Heading } from "@chakra-ui/core";

function Home() {
  return (
    <PageLayout
      title="Home"
      description="Description will go into a meta tag in <head />"
    >
      <Flex w="100%" justify="center">
        <Heading mt="72px" as="h1" fontSize="72px">
          DECSYS
        </Heading>
      </Flex>
    </PageLayout>
  );
}

export default Home;
