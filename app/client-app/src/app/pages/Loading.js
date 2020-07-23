import React from "react";
import LoadingIndicator from "components/core/LoadingIndicator";
import Layout from "app/layouts/Default";
import { Flex, useColorMode } from "@chakra-ui/core";

const Loading = () => {
  const { colorMode } = useColorMode();
  const style = {
    light: { borderColor: "gray.300", bg: "gray.100" },
    dark: { borderColor: "gray.600", bg: "gray.700" }
  };
  return (
    <Layout>
      <Flex justify="center">
        <Flex {...style[colorMode]} borderWidth={1} mt={10} boxShadow="callout">
          <LoadingIndicator />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Loading;
