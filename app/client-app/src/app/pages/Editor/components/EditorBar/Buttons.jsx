import {
  Button,
  useColorMode,
  useDisclosure,
  LightMode,
} from "@chakra-ui/react";
import { Link, useLocation } from "@reach/router";
import {
  FaChevronLeft,
  FaEye,
  FaFileExport,
  FaCopy,
  FaTrash,
} from "react-icons/fa";
import ExportModal from "components/shared/ExportModal";
import DeleteSurveyModal from "components/shared/DeleteSurveyModal";
import { useEditorBarContext } from "../../contexts/EditorBar";
import { defaultColorMode } from "themes";
import { CreateSurveyModal } from "components/shared/CreateSurveyModal";

export const BarButton = (p) => {
  const { colorMode } = useColorMode();
  const scheme =
    p.colorScheme || (colorMode || defaultColorMode) === "light"
      ? "dark-gray"
      : "gray";
  return (
    <Button
      colorScheme={scheme}
      lineHeight="inherit"
      height="100%"
      py={2}
      borderRadius={0}
      {...p}
    />
  );
};

export const BackButton = ({ parentFolderName }) => {
  const link = parentFolderName
    ? `/admin/folders/${parentFolderName}`
    : "/admin/surveys";
  return (
    <BarButton as={Link} to={link} leftIcon={<FaChevronLeft />}>
      Survey List
    </BarButton>
  );
};

export const PreviewButton = () => {
  const location = useLocation();
  return (
    <BarButton
      as={Link}
      to="preview"
      state={{ backRedirect: `${location.pathname}` }}
      leftIcon={<FaEye />}
    >
      Preview
    </BarButton>
  );
};

export const ExportButton = ({ id, name }) => {
  const modal = useDisclosure();
  return (
    <>
      <BarButton onClick={modal.onOpen} leftIcon={<FaFileExport />}>
        Export
      </BarButton>
      <ExportModal id={id} name={name} modalState={modal} />
    </>
  );
};

export const DuplicateButton = ({ name }) => {
  const { duplicate } = useEditorBarContext();
  const createSurveyModal = useDisclosure();
  const handleDuplicate = (name, type, settings) => {
    duplicate(name, type, settings);
    createSurveyModal.onClose();
  };
  return (
    <>
      <BarButton leftIcon={<FaCopy />} onClick={createSurveyModal.onOpen}>
        Duplicate
      </BarButton>
      <CreateSurveyModal
        name={`${name} (Copy)`} // we always use this modal for duplicating only
        modalState={createSurveyModal}
        onCreate={handleDuplicate}
      />
    </>
  );
};

export const DeleteButton = ({ name }) => {
  const modal = useDisclosure();
  const { deleteSurvey } = useEditorBarContext();
  return (
    <>
      <LightMode>
        <BarButton
          onClick={modal.onOpen}
          leftIcon={<FaTrash />}
          colorScheme="red"
        >
          Delete
        </BarButton>
      </LightMode>

      <DeleteSurveyModal
        name={name}
        onConfirm={deleteSurvey}
        modalState={modal}
      />
    </>
  );
};
