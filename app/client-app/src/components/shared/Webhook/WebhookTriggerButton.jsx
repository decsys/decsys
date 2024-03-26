import { useDisclosure } from "@chakra-ui/react";
import WebhookModal from "./WebhookModal";
import { MenuItem } from "@chakra-ui/react";

const WebhookTriggerButton = ({
  webhooks,
  handleWebhookAction,
  onFormOpen,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MenuItem onClick={onOpen}>Manage Webhooks</MenuItem>
      <WebhookModal
        isOpen={isOpen}
        onClose={onClose}
        webhooks={webhooks}
        handleWebhookAction={handleWebhookAction}
        onFormOpen={onFormOpen}
      />
    </>
  );
};

export default WebhookTriggerButton;
