import { Button } from "@chakra-ui/react";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const CreateBlankSurveyButton = () => {
  const { create } = useAddSurveyActions();
  return (
    <Button colorScheme="green" mb={1} onClick={create}>
      Start with a blank Survey
    </Button>
  );
};

export default CreateBlankSurveyButton;
