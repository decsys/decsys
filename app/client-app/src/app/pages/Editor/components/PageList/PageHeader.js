import React from "react";
import { Flex, useColorMode, Icon } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import { FaGripVertical } from "react-icons/fa";
import PageActionButtons from "./PageActionButtons";

const PageHeader = ({ page, order, dragHandleProps }) => {
  const { colorMode } = useColorMode();
  const headerStyle = { light: { bg: "gray.300" }, dark: { bg: "gray.600" } };
  return (
    <Flex
      borderTopRadius={5}
      align="center"
      justify="space-between"
      {...headerStyle[colorMode]}
      role="group"
    >
      <Flex {...dragHandleProps} p={2} align="center" width="100%">
        <Flex width="1.5em" justify="center">
          <Icon as={FaGripVertical} />
        </Flex>
        <LightHeading mx={2} size="sm">
          Page {order}
        </LightHeading>
      </Flex>

      <PageActionButtons {...page} />
    </Flex>
  );
};

export default PageHeader;
