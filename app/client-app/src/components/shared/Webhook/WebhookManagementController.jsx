import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { useWebhook } from "api/webhooks";
import { useWebhookManager } from "./useWebhookManager";
import WebhookEditCreateForm from "./WebhookEditCreateForm";
import WebhookManagementTrigger from "./WebhookManagementTrigger";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";

const WebhookManagementController = ({ surveyId }) => {
  const { mode } = useServerConfig();

  if (!surveyId || mode === WORKSHOP) {
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
