import React from "react";
import { Button, Flex } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import { FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";

const Header = () => {
  const { addPage } = usePageListContext();
  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Survey Pages</LightHeading>
      <Button variantColor="green" onClick={addPage} leftIcon={FaPlus}>
        Add Page
      </Button>
    </Flex>
  );
};

export default Header;
