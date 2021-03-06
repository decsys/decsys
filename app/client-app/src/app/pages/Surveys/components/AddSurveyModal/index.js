import StandardModal from "components/core/StandardModal";
import { Stack } from "@chakra-ui/react";
import CreateBlankSurveyButton from "./CreateBlankSurveyButton";
import LoadInternalSurveys from "./LoadInternalSurveys";
import ImportSurvey from "./ImportSurvey";

const AddSurveyModal = ({ modalState }) => {
  return (
    <StandardModal {...modalState} header="Add a Survey" cancelButton={false}>
      <Stack w="100%" spacing={1} mb={3}>
        <CreateBlankSurveyButton />
        <ImportSurvey modalState={modalState} />
        <LoadInternalSurveys closeModal={modalState.onClose} />
      </Stack>
    </StandardModal>
  );
};

export default AddSurveyModal;
