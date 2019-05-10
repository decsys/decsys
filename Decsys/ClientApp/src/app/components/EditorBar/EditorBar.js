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
import { useSurveyExport } from "../../utils/hooks";

const EditorBar = ({ id, name, disabled }) => {
  const deleteModal = useModal();
  const exportSurvey = useSurveyExport(id);

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
        {/* TODO: this will be a link again once more export modes are added
        <EditorBarLink href={`/admin/survey/${id}/export`} disabled={disabled}>
          <FileExport size="1em" /> Export
        </EditorBarLink> */}
        <EditorBarButton onClick={exportSurvey}>Export</EditorBarButton>
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
    </>
  );
};

EditorBar.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default EditorBar;
