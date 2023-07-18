import { Button, Flex, HStack } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import WebhookMenu from "../WebhookMenu/WebhookMenu";

const Header = () => {
  const { addPage } = usePageListContext();

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        <WebhookMenu />
      </HStack>
    </Flex>
  );
};

export default Header;
