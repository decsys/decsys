import { useRef, useState } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import WebhookForm from "./WebhookForm";
import WebhooksModal from "./WebhookModal";
import { useWebhook } from "api/webhooks";
import { useDisclosure } from "@chakra-ui/react";
import { createWebhook } from "api/webhooks";
import { updateWebhook } from "api/webhooks";

const WebhookMenu = () => {
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
      <WebhooksModal
        finalRef={finalRef}
        webhooks={data}
        onFormOpen={onFormOpen}
        handleWebhookAction={handleAddOrEditWebhook}
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

export default WebhookMenu;
