import { Button, useDisclosure } from "@chakra-ui/react";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const CreateBlankSurveyButton = ({ parentId }) => {
  const { create } = useAddSurveyActions();
  const createSurveyModal = useDisclosure();
  return (
    <>
      <Button colorScheme="green" mb={1} onClick={createSurveyModal.onOpen}>
        Start with a blank Survey
      </Button>
      <CreateSurveyModal
        modalState={createSurveyModal}
        onCreate={create}
        parentId={parentId}
      />
    </>
  );
};

export default CreateBlankSurveyButton;
