import { Suspense, useState, useEffect } from "react";
import { StandardModal, BusyPage } from "components/core";
import { Stack } from "@chakra-ui/react";
import { useSurvey } from "../../../../contexts/Survey";
import { useSurveyConfig, saveSurveyConfig } from "api/survey-config";
import produce from "immer";
import OneTimeParticipantsSwitch from "./OneTimeParticipantsSwitch";
import UseParticipantIdentifiersSwitch from "./UseParticipantIdentifersSwitch";
import ParticipantIdentifiersConfig from "./ParticipantIdentifiersConfig";

const BodyContent = ({ setConfig }) => {
  const { id } = useSurvey();
  const config = useSurveyConfig(id);

  useEffect(() => {
    setConfig(config.data);
  }, [config, setConfig]);

  return (
    <Stack>
      <OneTimeParticipantsSwitch {...config} />

      <UseParticipantIdentifiersSwitch {...config} />

      {config.data.useParticipantIdentifiers && (
        <ParticipantIdentifiersConfig {...config} />
      )}
    </Stack>
  );
};

const SurveyConfigModal = ({ modalState, name, id }) => {
  const [config, setConfig] = useState();
  const handleConfirm = async () => {
    await saveSurveyConfig(
      id,
      produce(config, (data) => {
        data.validIdentifiers = data.validIdentifiers.filter((x) => !!x);
      })
    );
    modalState.onClose();
  };
  return (
    <StandardModal
      closeOnOverlayClick={false}
      size="lg"
      header={`Configure ${name}`}
      confirmButton={{
        isDisabled: !config,
        children: "Save",
        colorScheme: "blue",
        onClick: handleConfirm,
      }}
      {...modalState}
    >
      <Suspense fallback={<BusyPage />}>
        <BodyContent setConfig={setConfig} />
      </Suspense>
    </StandardModal>
  );
};

export default SurveyConfigModal;
