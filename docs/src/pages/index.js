import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import PageLayout from "../components/PageLayout";
import { Stack, Flex, Heading, useColorMode } from "@chakra-ui/core";
import LinkButton from "../components/LinkButton";

const Banner = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex height="200px" bg={colorMode === "light" ? "gray.300" : "gray.700"}>
      <Stack w="100%" align="center" justify="center" spacing={8}>
        <Heading as="h1" size="2xl">
          DECSYS
        </Heading>
        <Heading as="h1" size="md">
          DISCRETE AND ELLIPSE-BASED RESPONSE CAPTURE SYSTEM
        </Heading>
      </Stack>
    </Flex>
  );
};

const Home = () => (
  <PageLayout
    title="Home"
    description="Description will go into a meta tag in <head />"
  >
    <Banner />

    <Stack h="250px" w="100%" align="center" justify="center" spacing={8}>
      <LinkButton
        to={useBaseUrl("/docs/users/overview")}
        colorScheme="blue"
        size="lg"
        p={8}
      >
        Run a Survey
      </LinkButton>
      <Stack direction="row">
        <LinkButton
          to={useBaseUrl("/docs/devs/custom-responses")}
          colorScheme="blue"
          size="lg"
          variant="outline"
        >
          Build Custom Responses
        </LinkButton>
        <LinkButton
          to={useBaseUrl("/docs/devs/contributing/source-code")}
          colorScheme="blue"
          size="lg"
          variant="outline"
        >
          Contribute
        </LinkButton>
      </Stack>
    </Stack>
  </PageLayout>
);

export default Home;
