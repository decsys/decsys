import { useRef, useState } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import WebhookForm from "./WebhookForm";
import WebhooksModal from "./WebhookModal";
import { useWebhook } from "api/webhooks";
import { useDisclosure } from "@chakra-ui/react";
import { createWebhook } from "api/webhooks";

const WebhookMenu = () => {
  const [editingWebhook, setEditingWebhook] = useState(null);
  const { id: surveyId } = useFetchSurvey();
  const { data, mutate } = useWebhook(surveyId);
  const finalRef = useRef(null);

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const handleAddWebhook = () => {
    setEditingWebhook(null);
    onFormOpen();
  };

  const handleEditWebhook = (webhook) => {
    setEditingWebhook(webhook);
    onFormOpen();
  };

  const handleSubmit = async (values) => {
    const {
      verifySsl,
      url,
      sourcePages,
      hasCustomTriggers,
      secret,
      pageNavigation,
    } = values;
    await createWebhook(
      surveyId,
      url,
      secret,
      verifySsl,
      sourcePages,
      hasCustomTriggers,
      pageNavigation
    );
    mutate();
    onFormClose();
  };

  return (
    <>
      <WebhooksModal
        finalRef={finalRef}
        webhooks={data}
        onAddWebhook={handleAddWebhook}
        onFormOpen={onFormOpen}
      />

      <WebhookForm
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setEditingWebhook(null);
        }}
        onSubmit={handleSubmit}
        webhook={editingWebhook}
      />
    </>
  );
};

export default WebhookMenu;
