import {
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import WebhookManagementController from "components/shared/Webhook/WebhookManagementController";
import { useFetchSurvey } from "app/contexts/FetchSurvey";

const Header = () => {
  const { addPage } = usePageListContext();
  const { id } = useFetchSurvey();

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        <Menu>
          <MenuButton
            border="thin solid"
            borderColor="gray.500"
            as={IconButton}
            icon={<FaEllipsisV />}
            boxSize={"40px"}
          />
          <MenuList>
            <WebhookManagementController surveyId={id} />
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header;
