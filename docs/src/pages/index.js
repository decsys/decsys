import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import PageLayout from "../components/PageLayout";
import { Stack, Flex, Heading, useColorMode, Image } from "@chakra-ui/core";
import LinkButton from "../components/LinkButton";
import { favicon } from "../../docusaurus.config";

const Banner = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex py={8} bg={colorMode === "light" ? "gray.300" : "gray.700"}>
      <Stack direction="row" w="100%" justify="center" spacing={8}>
        <Image src={favicon} />

        <Stack justify="center" spacing={8}>
          <Heading as="h1" size="md">
            DISCRETE AND ELLIPSE-BASED RESPONSE CAPTURE SYSTEM
          </Heading>
          <Heading as="h1" size="2xl">
            DECSYS
          </Heading>

          <Flex>
            <LinkButton
              to={useBaseUrl("/docs/users/overview")}
              colorScheme="blue"
              size="lg"
              p={8}
            >
              Get Started
            </LinkButton>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  );
};

const ActionCard = ({ to, buttonText }) => {
  return (
    <Stack p={4} borderRadius={5} border="thin solid">
      <Image src={favicon} boxSize="50px" />
      <LinkButton to={to} colorScheme="blue" size="lg" variant="outline">
        {buttonText}
      </LinkButton>
    </Stack>
  );
};

const Home = () => (
  <PageLayout
    title="Home"
    description="Description will go into a meta tag in <head />"
  >
    <Banner />

    <Stack p={8} w="100%" align="center" justify="center" spacing={8}>
      <Stack direction="row">
        <ActionCard
          to={useBaseUrl("/docs/devs/custom-responses/getting-started")}
          buttonText="Create Custom Responses"
        />

        <LinkButton
          to={useBaseUrl("/docs/devs/custom-responses/getting-started")}
          colorScheme="blue"
          size="lg"
          variant="outline"
        >
          Create Custom Responses
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
