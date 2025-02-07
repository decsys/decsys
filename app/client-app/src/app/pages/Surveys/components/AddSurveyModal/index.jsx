import StandardModal from "components/core/StandardModal";
import { Stack } from "@chakra-ui/react";
import CreateBlankSurveyButton from "./CreateBlankSurveyButton";
import LoadInternalSurveys from "./LoadInternalSurveys";
import ImportSurvey from "./ImportSurvey";

const AddSurveyModal = ({ modalState, parent, isStudy, parentFolderName }) => {
  return (
    <StandardModal
      {...modalState}
      header={`Add a ${isStudy ? "Study" : "Survey"}`}
      cancelButton={false}
    >
      <Stack w="100%" spacing={1} mb={3}>
        <CreateBlankSurveyButton
          closeModal={modalState.onClose}
          parent={parent}
          isStudy={isStudy}
          parentFolderName={parentFolderName}
        />
        <ImportSurvey
          modalState={modalState}
          parent={parent}
          isStudy={isStudy}
        />
        {!isStudy && (
          <LoadInternalSurveys
            closeModal={modalState.onClose}
            parent={parent}
          />
        )}
      </Stack>
    </StandardModal>
  );
};

export default AddSurveyModal;
