import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { MenuItem, MenuRouterLink, DropdownMenuButton } from "../ui";
import DeleteSurveyModal from "./DeleteSurveyModal";
import { EllipsisV } from "styled-icons/fa-solid";
import SurveyCardContext from "./Context";

const ManageSurveyButton = ({ name, editable, id }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const {
    handleEditClick,
    handleDuplicateClick,
    handleDeleteClick
  } = useContext(SurveyCardContext);

  return (
    <>
      <DropdownMenuButton
        title="More survey actions..."
        display="block"
        variant="secondary"
        button={<EllipsisV size="1em" />}
        caret={false}
      >
        {editable && (
          <MenuItem onClick={() => handleEditClick(id)}>Edit</MenuItem>
        )}
        <MenuRouterLink href={`admin/survey/${id}/preview`}>
          Preview
        </MenuRouterLink>
        <MenuRouterLink href={`admin/survey/${id}/export`}>
          Export
        </MenuRouterLink>
        <MenuItem onClick={() => handleDuplicateClick(id)}>Duplicate</MenuItem>
        <MenuItem onClick={toggleDeleteModal}>Delete</MenuItem>
      </DropdownMenuButton>
      <DeleteSurveyModal
        surveyName={name}
        deleteSurvey={() => handleDeleteClick(id)}
        closeModal={toggleDeleteModal}
        modalOpened={showDeleteModal}
      />
    </>
  );
};

ManageSurveyButton.propTypes = {
  id: PropTypes.number.isRequired,
  editable: PropTypes.bool,
  name: PropTypes.string.isRequired
};

ManageSurveyButton.defaultProps = { editable: false };

export default ManageSurveyButton;
