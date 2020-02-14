import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  Eye,
  Copy,
  FileExport,
  Trash,
  ChevronLeft
} from "styled-icons/fa-solid";
import { Grid } from "styled-css-grid";
import EditorBarButton, { LinkButton as EditorBarLink } from "./Button";
import NameInput from "./NameInput";
import DeleteSurveyModal from "../SurveyCard/DeleteSurveyModal";
import { useModal } from "../ui/ConfirmModal";
import EditorBarContext from "./Context";
import ExportModal from "../ExportModal";

const EditorBar = ({ id, name, disabled }) => {
  const deleteModal = useModal();
  const exportModal = useModal();

  const {
    nameUpdateState,
    handleNameChange,
    handleDuplicateClick,
    handleDeleteClick
  } = useContext(EditorBarContext);

  return (
    <>
      <Grid columnGap="0px" columns="auto 1fr auto auto auto auto">
        <EditorBarLink variant="uiPanel1" href="/" disabled={disabled}>
          <ChevronLeft size="1em" /> Survey List
        </EditorBarLink>
        <NameInput
          name={name}
          {...nameUpdateState}
          onChange={handleNameChange}
          disabled={disabled}
        />
        <EditorBarLink href={`/admin/survey/${id}/preview`} disabled={disabled}>
          <Eye size="1em" /> Preview
        </EditorBarLink>
        <EditorBarButton onClick={handleDuplicateClick} disabled={disabled}>
          <Copy size="1em" /> Duplicate
        </EditorBarButton>
        <EditorBarButton onClick={exportModal.toggleModal} disabled={disabled}>
          <FileExport size="1em" /> Export
        </EditorBarButton>
        <EditorBarButton
          variant="danger"
          onClick={deleteModal.toggleModal}
          disabled={disabled}
        >
          <Trash size="1em" /> Delete
        </EditorBarButton>
      </Grid>
      <DeleteSurveyModal
        surveyName={name}
        deleteSurvey={() => handleDeleteClick(id)}
        modalState={deleteModal}
      />
      <ExportModal survey={{ id, name }} modalState={exportModal} />
    </>
  );
};

EditorBar.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default EditorBar;
