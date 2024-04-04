import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { createWebhook, updateWebhook } from "api/webhooks";

export const useWebhookManager = (surveyId, mutate) => {
  const [currentWebhook, setCurrentWebhook] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddOrEditWebhook = (webhook) => {
    setCurrentWebhook(webhook);
    onOpen();
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
    onClose();
  };

  return {
    isFormOpen: isOpen,
    onFormOpen: onOpen,
    onFormClose: onClose,
    handleAddOrEditWebhook,
    handleSubmit,
    currentWebhook,
  };
};
