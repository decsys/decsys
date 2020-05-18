import React from "react";
import { Flex, useColorMode, Box } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import { FaGripVertical } from "react-icons/fa";
import PageActionButtons from "./PageActionButtons";

const PageHeader = ({ isPageHovered, page, dragHandleProps }) => {
  const { colorMode } = useColorMode();
  const headerStyle = { light: { bg: "gray.300" }, dark: { bg: "gray.600" } };
  return (
    <Flex
      roundedTop={5}
      align="center"
      justify="space-between"
      {...headerStyle[colorMode]}
    >
      <Flex {...dragHandleProps} p={2} align="center" width="100%">
        <Box as={FaGripVertical} />
        <LightHeading mx={2} size="sm">
          Page {page.order}
        </LightHeading>
      </Flex>

      <PageActionButtons id={page.id} isPageHovered={isPageHovered} />
    </Flex>
  );
};

export default PageHeader;
