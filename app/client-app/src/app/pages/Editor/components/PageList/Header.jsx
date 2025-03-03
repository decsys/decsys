import {
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Box,
} from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import WebhookManagementController from "components/shared/Webhook/WebhookManagementController";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";

const Header = () => {
  const { addPage } = usePageListContext();
  const { id } = useFetchSurvey();
  const { mode } = useServerConfig();

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        {mode !== WORKSHOP && (
          <Box>
            <Menu>
              <MenuButton
                border="thin solid"
                borderColor="gray.500"
                as={IconButton}
                icon={<FaEllipsisV />}
                boxSize={"40px"}
              />
              <MenuList style={{ margin: 0 }}>
                <WebhookManagementController surveyId={id} />
              </MenuList>
            </Menu>
          </Box>
        )}
      </HStack>
    </Flex>
  );
};

export default Header;
