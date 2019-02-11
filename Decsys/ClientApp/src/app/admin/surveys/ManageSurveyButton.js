import React, { Component } from "react";
import { connect } from "react-redux";
import DropdownMenuButton from "../../common/DropdownMenuButton";
import MenuItem from "../../common/MenuItem";
import MenuRouterLink from "../../common/MenuRouterLink";
import { DuplicateSurvey, DeleteSurvey } from "./_actions";
import DeleteSurveyModal from "./DeleteSurveyModal";

class ManageSurveyButton extends Component {
  constructor(props) {
    super(props);
    this.state = { showDeleteModal: false };
  }

  toggleDeleteModal = () =>
    this.setState(prev => ({ showDeleteModal: !prev.showDeleteModal }));

  render() {
    const { name, runCount, id, onDuplicateClick, onDeleteClick } = this.props;
    return (
      <>
        <DropdownMenuButton button="Manage">
          {runCount <= 0 ? (
            <MenuRouterLink to={`survey/${id}`}>Edit</MenuRouterLink>
          ) : null}
          <MenuRouterLink to={`survey/${id}/preview`}>Preview</MenuRouterLink>
          <MenuRouterLink to={`survey/${id}/export`}>Export</MenuRouterLink>
          <MenuItem onClick={onDuplicateClick}>Duplicate</MenuItem>
          <MenuItem onClick={this.toggleDeleteModal}>Delete</MenuItem>
        </DropdownMenuButton>
        <DeleteSurveyModal
          surveyName={name}
          deleteSurvey={onDeleteClick}
          closeModal={this.toggleDeleteModal}
          modalOpened={this.state.showDeleteModal}
        />
      </>
    );
  }
}

const ManageSurveyButtonContainer = connect(
  null,
  (dispatch, { id }) => ({
    onDuplicateClick: () => dispatch(DuplicateSurvey(id)),
    onDeleteClick: () => dispatch(DeleteSurvey(id))
  })
)(ManageSurveyButton);

export default ManageSurveyButtonContainer;
