import React, { Suspense } from "react";
import { StandardModal, LoadingIndicator } from "components/core";
import { Text, Flex, Textarea, Alert, AlertIcon } from "@chakra-ui/core";
import { useSurveyInstance } from "api/survey-instances";
import { useSurvey } from "../../contexts/Survey";
import { useInstanceFriendlyId } from "../../contexts/InstanceFriendlyId";

const BodyContent = () => {
  const survey = useSurvey();
  const friendlyId = useInstanceFriendlyId();
  const {
    data: { useParticipantIdentifiers, validIdentifiers }
  } = useSurveyInstance(survey.id, survey.activeInstanceId);

  return useParticipantIdentifiers &&
    validIdentifiers &&
    validIdentifiers.length ? (
    <Flex flexDirection="column" width="100%">
      <Text variant="h6">
        Valid Participant Identifiers for Survey{" "}
        <Text as="span" fontWeight="bold">
          {friendlyId}
        </Text>
      </Text>
      <Textarea
        resize="vertical"
        height="inherit"
        rows={10}
        readOnly
        defaultValue={validIdentifiers.join("\n")}
      />
    </Flex>
  ) : (
    <Alert status="info" width="100%">
      <AlertIcon />{" "}
      <Text>
        No specific Participant Identifiers for Survey{" "}
        <Text as="span" fontWeight="bold">
          {friendlyId}
        </Text>
      </Text>
    </Alert>
  );
};

const InstanceValidIdModal = ({ modalState }) => {
  return (
    <StandardModal
      closeOnOverlayClick={false}
      size="lg"
      {...modalState}
      header="Valid Participant Identifiers"
      cancelButton={false}
    >
      <Suspense fallback={<LoadingIndicator />}>
        <BodyContent />
      </Suspense>
    </StandardModal>
  );
};

export default InstanceValidIdModal;
