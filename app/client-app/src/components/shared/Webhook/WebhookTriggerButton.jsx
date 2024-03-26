import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/fa";
import WebhookModal from "./WebhookModal";

const WebhookTriggerButton = ({
  webhooks,
  handleWebhookAction,
  onFormOpen,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu>
      <MenuButton
        border="thin solid"
        borderColor="gray.500"
        as={IconButton}
        icon={<FaEllipsisV />}
        boxSize={"40px"}
      />
      <MenuList>
        <MenuItem onClick={onOpen}>Manage Webhooks ...</MenuItem>
      </MenuList>
      <WebhookModal
        isOpen={isOpen}
        onClose={onClose}
        webhooks={webhooks}
        handleWebhookAction={handleWebhookAction}
        onFormOpen={onFormOpen}
      />
    </Menu>
  );
};

export default WebhookTriggerButton;
