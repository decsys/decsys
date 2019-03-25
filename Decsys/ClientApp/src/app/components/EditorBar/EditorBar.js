import React, { useState } from "react";
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

const EditorBar = ({
  id,
  name,
  nameUpdateState,
  onNameChange,
  disabled,
  onDuplicateClick,
  onDeleteClick
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
  return (
    <>
      <Grid columnGap="0px" columns="auto 1fr auto auto auto auto">
        <EditorBarLink variant="uiPanel1" to="/" disabled={disabled}>
          <ChevronLeft size="1em" /> Survey List
        </EditorBarLink>
        <NameInput
          name={name}
          {...nameUpdateState}
          onChange={onNameChange}
          disabled={disabled}
        />
        <EditorBarLink to={`/admin/survey/${id}/preview`} disabled={disabled}>
          <Eye size="1em" /> Preview
        </EditorBarLink>
        <EditorBarButton onClick={onDuplicateClick} disabled={disabled}>
          <Copy size="1em" /> Duplicate
        </EditorBarButton>
        <EditorBarLink to={`/admin/survey/${id}/export`} disabled={disabled}>
          <FileExport size="1em" /> Export
        </EditorBarLink>
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
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  nameUpdateState: PropTypes.shape({
    saving: PropTypes.bool,
    saved: PropTypes.bool
  }),
  onNameChange: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default EditorBar;
