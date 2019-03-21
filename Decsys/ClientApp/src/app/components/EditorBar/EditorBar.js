import React, { useState } from "react";
import PropTypes from "prop-types";
import { Eye, Copy, FileExport, Trash } from "styled-icons/fa-solid";
import { Grid } from "styled-css-grid";
import EditorBarButton from "./Button";
import NameInput from "./NameInput";
import DeleteSurveyModal from "../SurveyCard/DeleteSurveyModal";

const EditorBar = ({
  name,
  nameUpdateState,
  onNameChange,
  disabled,
  onPreviewClick,
  onDuplicateClick,
  onExportClick,
  onDeleteClick
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
  return (
    <>
      <Grid columnGap="0px" columns="1fr auto auto auto auto">
        <NameInput
          name={name}
          {...nameUpdateState}
          onChange={onNameChange}
          disabled={disabled}
        />
        <EditorBarButton onClick={onPreviewClick} disabled={disabled}>
          <Eye size="1em" /> Preview
        </EditorBarButton>
        <EditorBarButton onClick={onDuplicateClick} disabled={disabled}>
          <Copy size="1em" /> Duplicate
        </EditorBarButton>
        <EditorBarButton onClick={onExportClick} disabled={disabled}>
          <FileExport size="1em" /> Export
        </EditorBarButton>
        <EditorBarButton
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
          disabled={disabled}
        >
          <Trash size="1em" /> Delete
        </EditorBarButton>
      </Grid>
      <DeleteSurveyModal
        surveyName={name}
        deleteSurvey={onDeleteClick}
        closeModal={toggleDeleteModal}
        modalOpened={showDeleteModal}
      />
    </>
  );
};

EditorBar.propTypes = {
  name: PropTypes.string.isRequired,
  nameUpdateState: PropTypes.shape({
    name: PropTypes.shape({
      saving: PropTypes.bool,
      saved: PropTypes.bool
    })
  }),
  onNameChange: PropTypes.func.isRequired,
  onPreviewClick: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default EditorBar;
