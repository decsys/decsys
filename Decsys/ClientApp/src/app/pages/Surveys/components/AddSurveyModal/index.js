import React from "react";
import StandardModal from "components/core/StandardModal";
import { Stack } from "@chakra-ui/core";
import CreateBlankSurveyButton from "./CreateBlankSurveyButton";
import LoadInternalSurveys from "./LoadInternalSurveys";
import ImportSurvey from "./ImportSurvey";

const AddSurveyModal = ({ modalState }) => {
  return (
    <StandardModal {...modalState} header="Add a Survey" cancelButton={false}>
      <Stack gap={1} mb={3}>
        <CreateBlankSurveyButton />
        <ImportSurvey />
        <LoadInternalSurveys closeModal={modalState.onClose} />
      </Stack>
    </StandardModal>
  );
};

export default AddSurveyModal;
