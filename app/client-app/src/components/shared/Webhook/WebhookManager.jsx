import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { useWebhook } from "api/webhooks";
import { useWebhookManager } from "./useWebhookManager"; // Custom hook
import WebhookForm from "./WebhookForm";
import WebhookTriggerButton from "./WebhookTriggerButton";

const WebhookManager = () => {
  const { id: surveyId } = useFetchSurvey();
  const { data, mutate } = useWebhook(surveyId);
  const {
    isFormOpen,
    onFormClose,
    handleSubmit,
    handleAddOrEditWebhook,
    currentWebhook,
  } = useWebhookManager(surveyId, mutate);

  return (
    <>
      <WebhookTriggerButton
        webhooks={data}
        handleWebhookAction={handleAddOrEditWebhook}
      />
      <WebhookForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleSubmit}
        webhook={currentWebhook}
      />
    </>
  );
};

export default WebhookManager;
