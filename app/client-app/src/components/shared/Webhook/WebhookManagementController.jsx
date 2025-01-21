import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { useWebhook } from "api/webhooks";
import { useWebhookManager } from "./useWebhookManager";
import WebhookEditCreateForm from "./WebhookEditCreateForm";
import WebhookManagementTrigger from "./WebhookManagementTrigger";

const WebhookManagementController = ({ surveyId }) => {
  if (!surveyId) {
    return null;
  }

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
      <WebhookManagementTrigger
        webhooks={data}
        handleWebhookAction={handleAddOrEditWebhook}
      />
      <WebhookEditCreateForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleSubmit}
        webhook={currentWebhook}
      />
    </>
  );
};

export default WebhookManagementController;
