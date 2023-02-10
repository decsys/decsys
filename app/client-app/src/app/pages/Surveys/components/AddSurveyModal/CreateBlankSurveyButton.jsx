import { Button, useDisclosure } from "@chakra-ui/react";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const CreateBlankSurveyButton = ({ parent, isStudy, closeModal }) => {
  const { create } = useAddSurveyActions();
  const createSurveyModal = useDisclosure();

  const handleCreate = async (...args) => {
    await create(...args);
    closeModal();
  };

  return (
    <>
      <Button colorScheme="green" mb={1} onClick={createSurveyModal.onOpen}>
        Start with {isStudy ? "an empty Study" : "a blank Survey"}
      </Button>
      <CreateSurveyModal
        modalState={createSurveyModal}
        onCreate={handleCreate}
        parentId={parent?.id}
        isStudy={isStudy}
        type={parent?.type}
        isFixedType={!!parent}
        hasFixedSettings={!!parent}
      />
    </>
  );
};

export default CreateBlankSurveyButton;
