import { Button, Flex, HStack } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import WebhookMenu from "../Webhook/WebhookMenu";
import { useServerConfig } from "api/config";

const Header = () => {
  const { addPage } = usePageListContext();
  const { webhookEnabled } = useServerConfig();

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        {webhookEnabled && <WebhookMenu />}
      </HStack>
    </Flex>
  );
};

export default Header;
