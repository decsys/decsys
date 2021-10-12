import React from "react"; // eslint-disable-line no-unused-vars
import {
  Stack,
  Flex,
  Heading,
  useColorMode,
  Image,
  Text,
} from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";
import { favicon } from "../../config/default.config";
import Layout from "../theme/Layout";

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
            <LinkButton to="/docs/" colorScheme="blue" size="lg" p={8}>
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
    <Stack align="center" width="300px" direction="row">
      <Image src={favicon} boxSize="50px" />
      <LinkButton
        width="300px"
        to={to}
        colorScheme="blue"
        size="lg"
        variant="outline"
      >
        {buttonText}
      </LinkButton>
    </Stack>
  );
};

const Home = () => (
  <Layout
    title="Home"
    description="Description will go into a meta tag in <head />"
  >
    <Banner />

    <Stack p={8} w="100%" align="center" justify="center">
      <Stack>
        <Text>More information:</Text>
        <ActionCard
          to="/docs/devs/custom-responses/getting-started"
          buttonText="Create Custom Responses"
        />

        <ActionCard
          to="/docs/devs/technical/architecture"
          buttonText="Technical Reference"
        />

        <ActionCard
          to="/docs/devs/contributing/source-code"
          buttonText="Contribute"
        />
      </Stack>
    </Stack>
  </Layout>
);

export default Home;
