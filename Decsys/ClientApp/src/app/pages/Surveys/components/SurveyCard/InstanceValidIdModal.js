import React, { Suspense } from "react";
import { StandardModal, LoadingIndicator } from "components/core";
import { Text, Flex, Textarea, Alert, AlertIcon } from "@chakra-ui/core";
import { useInstanceValidIds } from "api/survey-instances";
import { useSurvey } from "../../contexts/Survey";
import { useInstanceFriendlyId } from "../../contexts/InstanceFriendlyId";

const BodyContent = () => {
  const survey = useSurvey();
  const friendlyId = useInstanceFriendlyId();
  const instanceValidIds = useInstanceValidIds(
    survey.id,
    survey.activeInstanceId
  );

  return instanceValidIds && instanceValidIds.length ? (
    <Flex flexDirection="column" width="100%">
      <Text variant="h6">
        Valid Participant Identifiers for Survey{" "}
        <Text fontWeight="bold">{friendlyId}</Text>
      </Text>
      <Textarea style={{ resize: "vertical" }} rows={10} readOnly>
        {instanceValidIds.join("\n")}
      </Textarea>
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
