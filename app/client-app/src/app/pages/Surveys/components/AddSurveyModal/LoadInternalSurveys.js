import { useState } from "react";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";

const names = {
  demo: "Demo Survey",
  sample: "Sample Research Survey",
};

const LoadInternalSurveys = ({ closeModal }) => {
  const { loadInternal } = useAddSurveyActions();
  const createSurveyModal = useDisclosure();
  const [internalKey, setInternalKey] = useState();

  const doImport = (name, type, settings) => {
    loadInternal(internalKey, name, type, settings);
    createSurveyModal.onClose();
    closeModal();
  };

  const handleClick = (key) => {
    setInternalKey(key);
    createSurveyModal.onOpen();
  };
  const handleDemoClick = () => handleClick("demo");
  const handleSampleClick = () => handleClick("sample");

  return (
    <>
      <Tooltip
        hasArrow
        label="This Survey demonstrates the features of the DECSYS Survey Platform."
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
      <CreateSurveyModal
        name={names[internalKey]}
        modalState={createSurveyModal}
        onCreate={doImport}
      />
    </>
  );
};

export default LoadInternalSurveys;
