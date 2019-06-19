import React, { useContext } from "react";
import PropTypes from "prop-types";
import { MenuItem, MenuRouterLink, DropdownMenuButton } from "../ui";
import DeleteSurveyModal from "./DeleteSurveyModal";
import { useModal } from "../ui/ConfirmModal";
import { EllipsisV } from "styled-icons/fa-solid";
import SurveyCardContext from "./Context";
import SurveyConfigModal from "./SurveyConfigModal";
import ExportModal from "../ExportModal";

const ManageSurveyButton = ({ name, editable, id }) => {
  const deleteModal = useModal();
  const configModal = useModal();
  const exportModal = useModal();

  const {
    handleEditClick,
    handleDuplicateClick,
    handleDeleteClick
  } = useContext(SurveyCardContext);

  return (
    <>
      <DropdownMenuButton
        display="block"
        variant="secondary"
        button={<EllipsisV size="1em" />}
        caret={false}
        tooltip={{ placement: "top", content: "More survey actions..." }}
      >
        {editable && (
          <MenuItem onClick={() => handleEditClick(id)}>Edit</MenuItem>
        )}
        <MenuItem onClick={configModal.toggleModal}>Configure</MenuItem>
        <MenuRouterLink href={`admin/survey/${id}/preview`}>
          Preview
        </MenuRouterLink>
        <MenuItem onClick={exportModal.toggleModal}>Export</MenuItem>
        <MenuItem onClick={() => handleDuplicateClick(id)}>Duplicate</MenuItem>
        <MenuItem onClick={deleteModal.toggleModal}>Delete</MenuItem>
      </DropdownMenuButton>
      <DeleteSurveyModal
        surveyName={name}
        deleteSurvey={() => handleDeleteClick(id)}
        modalState={deleteModal}
      />
      <SurveyConfigModal
        surveyId={id}
        surveyName={name}
        modalState={configModal}
      />
      <ExportModal survey={{ id, name }} modalState={exportModal} />
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
