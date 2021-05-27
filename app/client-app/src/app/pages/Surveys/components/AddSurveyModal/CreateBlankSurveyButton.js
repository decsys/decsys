import { Button, useDisclosure } from "@chakra-ui/react";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const CreateBlankSurveyButton = () => {
  const { create } = useAddSurveyActions(); // TODO: name, type, settings
  const modalState = useDisclosure();

  const handleClick = () => {
    modalState.onOpen(); // open the follow up
  };
  return (
    <>
      <Button colorScheme="green" mb={1} onClick={handleClick}>
        Start with a blank Survey
      </Button>
      <CreateSurveyModal modalState={modalState} onCreate={create} />
    </>
  );
};

export default CreateBlankSurveyButton;
