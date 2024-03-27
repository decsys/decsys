import { useDisclosure } from "@chakra-ui/react";
import WebhookListModal from "./WebhookListModal";
import { MenuItem } from "@chakra-ui/react";

const WebhookManagementTrigger = ({
  webhooks,
  handleWebhookAction,
  onFormOpen,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen}>Manage Webhooks</MenuItem>
      <WebhookListModal
        isOpen={isOpen}
        onClose={onClose}
        webhooks={webhooks}
        handleWebhookAction={handleWebhookAction}
        onFormOpen={onFormOpen}
      />
    </>
  );
};

export default WebhookManagementTrigger;
