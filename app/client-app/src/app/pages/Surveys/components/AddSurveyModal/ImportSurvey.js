import { useState } from "react";
import {
  Button,
  Flex,
  Collapse,
  Input,
  Stack,
  Checkbox,
  AlertIcon,
  Alert,
  useDisclosure,
} from "@chakra-ui/react";
import { FaFileImport } from "react-icons/fa";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";
import JSZip from "jszip";
import { stripBom } from "services/data-structures";

const ImportSurvey = (p) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Button mb={1} onClick={onToggle}>
        Import an existing {p.isStudy ? "Study" : "Survey"}...
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <ImportSurveyForm {...p} />
      </Collapse>
    </>
  );
};

const isZip = (filename) => filename.split(".").pop().toLowerCase() === "zip";

const ImportSurveyForm = ({
  modalState,
  isStudy,
  parent: { id: parentId } = {},
}) => {
  const [oldSurveyDetails, setOldSurveyDetails] = useState();
  const { importFile } = useAddSurveyActions();
  const createSurveyModal = useDisclosure();

  const [state, setState] = useState({
    importData: false,
  });

  const handleFileSelect = (e) => {
    e.persist();
    const error = !isZip(e.target.value)
      ? "Invalid file extension. Expected .zip"
      : null;
    setState({ ...state, error, file: e.target.files[0] });
  };

  const handleDataImportChange = (e) => {
    setState({ ...state, importData: e.target.checked });
  };

  const doImport = (name, type, settings, creationOptions) => {
    importFile(
      state.file,
      state.importData,
      name,
      type,
      settings,
      creationOptions
    );
    createSurveyModal.onClose();
    modalState.onClose();
  };

  const handleImportClick = async () => {
    if (!state.file || state.error) return;

    // get some structure details from within the zip file locally :)
    try {
      var zip = new JSZip();
      const zipFile = await zip.loadAsync(state.file);
      const content = await zipFile.file("structure.json").async("string");
      const oldSurvey = JSON.parse(stripBom(content));

      if (parentId && oldSurvey.IsStudy) {
        setState({
          ...state,
          error:
            "The provided file is an exported Study, but you can't import a Study into another Study.",
        });
        return;
      }

      setOldSurveyDetails({
        name: oldSurvey.Name,
        type: oldSurvey.Type,
        settings: oldSurvey.Settings,
      });
    } catch {
      setState({
        ...state,
        error:
          "Couldn't read a valid a 'structure.json' within the provided .zip file",
      });
      return;
    }
    createSurveyModal.onOpen();
  };

  return (
    <Stack spacing={1} p={2}>
      <Alert>
        <AlertIcon />
        Select a previously exported DECSYS Survey file to import.
      </Alert>

      <Input type="file" onChange={handleFileSelect} />
      {state.error && (
        <Alert status="error">
          <AlertIcon />
          {state.error}
        </Alert>
      )}

      <Checkbox onChange={handleDataImportChange} isChecked={state.importData}>
        Also import any Results Data
      </Checkbox>

      <Flex justifyContent="flex-end">
        <Button
          colorScheme="blue"
          leftIcon={<FaFileImport />}
          onClick={handleImportClick}
        >
          Import
        </Button>
      </Flex>
      <CreateSurveyModal
        {...oldSurveyDetails}
        modalState={createSurveyModal}
        onCreate={doImport}
        isFixedType={state.importData || !!parentId}
        hasFixedSettings={state.importData || !!parentId}
        isStudy={isStudy}
        parentId={parentId}
      />
    </Stack>
  );
};

export default ImportSurvey;
