import { Button, Flex, HStack } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import { useServerConfig } from "api/config";
import WebhookManager from "components/shared/Webhook/WebhookManager";

const Header = () => {
  const { addPage } = usePageListContext();

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        <WebhookManager />
      </HStack>
    </Flex>
  );
};

export default Header;
