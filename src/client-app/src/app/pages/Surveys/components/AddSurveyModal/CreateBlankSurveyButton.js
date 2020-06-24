import React from "react";
import { Button } from "@chakra-ui/core";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const CreateBlankSurveyButton = () => {
  const { create } = useAddSurveyActions();
  return (
    <Button variantColor="green" mb={1} onClick={create}>
      Start with a blank Survey
    </Button>
  );
};

export default CreateBlankSurveyButton;
