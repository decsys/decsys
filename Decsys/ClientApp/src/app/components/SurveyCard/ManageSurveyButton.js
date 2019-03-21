import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MenuItem, MenuRouterLink, DropdownMenuButton } from "../ui";
import DeleteSurveyModal from "./DeleteSurveyModal";
import { EllipsisV } from "styled-icons/fa-solid";
import {
  deleteSurvey,
  duplicateSurvey,
  editSurvey
} from "../../state/ducks/surveys";

const PureManageSurveyButton = ({
  name,
  editable,
  id,
  onDuplicateClick,
  onDeleteClick,
  onEditClick
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  return (
    <>
      <DropdownMenuButton
        title="More survey actions..."
        display="block"
        variant="secondary"
        button={<EllipsisV size="1em" />}
        caret={false}
      >
        {editable && <MenuItem onClick={onEditClick}>Edit</MenuItem>}
        <MenuRouterLink to={`admin/survey/${id}/preview`}>
          Preview
        </MenuRouterLink>
        <MenuRouterLink to={`admin/survey/${id}/export`}>Export</MenuRouterLink>
        <MenuItem onClick={onDuplicateClick}>Duplicate</MenuItem>
        <MenuItem onClick={toggleDeleteModal}>Delete</MenuItem>
      </DropdownMenuButton>
      <DeleteSurveyModal
        surveyName={name}
        deleteSurvey={onDeleteClick}
        closeModal={toggleDeleteModal}
        modalOpened={showDeleteModal}
      />
    </>
  );
};

PureManageSurveyButton.propTypes = {
  id: PropTypes.number.isRequired,
  editable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onDuplicateClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired
};

PureManageSurveyButton.defaultProps = { editable: false };

const ManageSurveyButton = connect(
  null,
  (dispatch, { id, name }) => ({
    onDuplicateClick: () => dispatch(duplicateSurvey(id)),
    onDeleteClick: () => dispatch(deleteSurvey(id)),
    onEditClick: () => dispatch(editSurvey(id, name))
  })
)(PureManageSurveyButton);

export { PureManageSurveyButton };
export default ManageSurveyButton;
