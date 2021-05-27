import { useState } from "react";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const LoadInternalSurveys = ({ closeModal }) => {
  const { loadInternal } = useAddSurveyActions();
  const modalState = useDisclosure();
  const [internalKey, setInternalKey] = useState();

  const doImport = (name, type, settings) => {
    loadInternal(internalKey); // TODO: name, type, settings
    modalState.onClose();
    closeModal();
  };

  const handleClick = (key) => {
    setInternalKey(key);
    modalState.onOpen();
  };
  const handleDemoClick = () => handleClick("demo");
  const handleSampleClick = () => handleClick("sample");

  return (
    <>
      <Tooltip
        hasArrow
        label="This Survey demonstrates the features of the DECSYS
            Survey Platform."
      >
        <Button variant="outline" mb={1} onClick={handleDemoClick}>
          Load the Demo Survey
        </Button>
      </Tooltip>

      <Tooltip
        hasArrow
        label="This Survey shows the Platform using the Ellipse Rating Scale in a Research context."
      >
        <Button variant="outline" onClick={handleSampleClick}>
          Load the Sample Research Survey
        </Button>
      </Tooltip>
      <CreateSurveyModal modalState={modalState} onCreate={doImport} />
    </>
  );
};

export default LoadInternalSurveys;
