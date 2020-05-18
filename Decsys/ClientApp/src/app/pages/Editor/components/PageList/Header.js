import React from "react";
import { Button, Flex } from "@chakra-ui/core";
import LightHeading from "components/core/LightHeading";
import { FaPlus } from "react-icons/fa";
import { usePageListActions } from "../../contexts/PageListActions";

const Header = () => {
  const { addPage } = usePageListActions();
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
