import React from "react";
import {
  Button,
  useColorMode,
  useDisclosure,
  LightMode
} from "@chakra-ui/core";
import { Link } from "@reach/router";
import {
  FaChevronLeft,
  FaEye,
  FaFileExport,
  FaCopy,
  FaTrash
} from "react-icons/fa";
import ExportModal from "components/shared/ExportModal";
import DeleteSurveyModal from "components/shared/DeleteSurveyModal";
import { useEditorBarContext } from "../../contexts/EditorBar";

const BarButton = p => {
  const { colorMode } = useColorMode();
  const variant =
    p.variantColor || colorMode === "light" ? "dark-gray" : "gray";
  return (
    <Button
      variantColor={variant}
      lineHeight="inherit"
      height="100%"
      py={2}
      borderRadius={0}
      {...p}
    />
  );
};

export const BackButton = () => (
  <BarButton as={Link} to="/admin" leftIcon={FaChevronLeft}>
    Survey List
  </BarButton>
);

export const PreviewButton = () => (
  <BarButton as={Link} to="preview" leftIcon={FaEye}>
    Preview
  </BarButton>
);

export const ExportButton = ({ id, name }) => {
  const modal = useDisclosure();
  return (
    <>
      <BarButton onClick={modal.onOpen} leftIcon={FaFileExport}>
        Export
      </BarButton>
      <ExportModal id={id} name={name} modalState={modal} />
    </>
  );
};

export const DuplicateButton = () => {
  const { duplicate } = useEditorBarContext();
  return (
    <BarButton leftIcon={FaCopy} onClick={duplicate}>
      Duplicate
    </BarButton>
  );
};

export const DeleteButton = ({ name }) => {
  const modal = useDisclosure();
  const { deleteSurvey } = useEditorBarContext();
  return (
    <>
      <LightMode>
        <BarButton onClick={modal.onOpen} leftIcon={FaTrash} variantColor="red">
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
