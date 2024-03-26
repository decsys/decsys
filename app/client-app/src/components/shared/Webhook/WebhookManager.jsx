import { useRef, useState } from "react";
import { useWebhook } from "api/webhooks";
import { useDisclosure } from "@chakra-ui/react";
import { createWebhook } from "api/webhooks";
import { updateWebhook } from "api/webhooks";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import WebhookModal from "./WebhookModal";
import WebhookForm from "./WebhookForm";
import WebhookTriggerButton from "./WebhookTriggerButton";

const WebhookManager = () => {
  const { id: surveyId } = useFetchSurvey();
  const { data, mutate } = useWebhook(surveyId);
  const finalRef = useRef(null);

  const [currentWebhook, setCurrentWebhook] = useState(null);

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const handleAddOrEditWebhook = (webhook) => {
    setCurrentWebhook(webhook);
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

    if (currentWebhook && currentWebhook.id) {
      await updateWebhook(
        currentWebhook.id,
        surveyId,
        url,
        secret,
        verifySsl,
        sourcePages,
        hasCustomTriggers,
        pageNavigation
      );
    } else {
      await createWebhook(
        surveyId,
        url,
        secret,
        verifySsl,
        sourcePages,
        hasCustomTriggers,
        pageNavigation
      );
    }

    mutate();
    onFormClose();
  };

  return (
    <>
      <WebhookTriggerButton
        webhooks={data}
        handleWebhookAction={handleAddOrEditWebhook}
        onFormOpen={onFormOpen}
      />
      <WebhookForm
        isOpen={isFormOpen}
        onClose={() => {
          onFormClose();
          setCurrentWebhook(null);
        }}
        onSubmit={handleSubmit}
        webhook={currentWebhook}
      />
    </>
  );
};

export default WebhookManager;
