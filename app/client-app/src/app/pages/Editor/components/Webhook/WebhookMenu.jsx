import { useRef, useState } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import WebhookForm from "./WebhookForm";
import WebhooksModal from "./WebhookModal";
import { useWebhook } from "api/webhooks";
import { useDisclosure } from "@chakra-ui/react";
import { createWebhook } from "api/webhooks";

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
        onAddWebhook={handleAddOrEditWebhook}
        onFormOpen={onFormOpen}
        handleAddOrEditWebhook={handleAddOrEditWebhook}
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
