import React from "react";
import { Button, Tooltip } from "@chakra-ui/core";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const LoadInternalSurveys = ({ closeModal }) => {
  const { loadInternal } = useAddSurveyActions();

  const handleClick = type => {
    loadInternal(type);
    closeModal();
  };
  const handleDemoClick = () => handleClick("demo");
  const handleSampleClick = () => handleClick("sample");

  return (
    <>
      <Tooltip
        zIndex={999999}
        hasArrow
        label="This Survey demonstrates the features of the DECSYS
            Survey Platform."
      >
        <Button variant="outline" mb={1} onClick={handleDemoClick}>
          Load the Demo Survey
        </Button>
      </Tooltip>

      <Tooltip
        zIndex={999999}
        hasArrow
        label="This Survey shows the Platform using the Ellipse Rating Scale in a Research context."
      >
        <Button variant="outline" onClick={handleSampleClick}>
          Load the Sample Research Survey
        </Button>
      </Tooltip>
    </>
  );
};

export default LoadInternalSurveys;
