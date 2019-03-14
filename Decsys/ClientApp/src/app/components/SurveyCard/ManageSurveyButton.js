import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DropdownMenuButton from "../ui/DropdownMenuButton";
import MenuItem from "../ui/MenuItem";
import MenuRouterLink from "../ui/MenuRouterLink";
import DeleteSurveyModal from "./DeleteSurveyModal";
import { EllipsisV } from "styled-icons/fa-solid";

class ManageSurveyButton extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    editable: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onDuplicateClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    editable: false
  };

  constructor(props) {
    super(props);
    this.state = { showDeleteModal: false };
  }

  toggleDeleteModal = () =>
    this.setState(prev => ({ showDeleteModal: !prev.showDeleteModal }));

  render() {
    const { name, editable, id, onDuplicateClick, onDeleteClick } = this.props;
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
            <MenuRouterLink to={`survey/${id}`}>Edit</MenuRouterLink>
          )}
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
    onDuplicateClick: () => dispatch({ type: "REPLACE_ME" }), // duplicateSurvey(id)), // TODO: action
    onDeleteClick: () => dispatch({ type: "REPLACE_ME" }) //DeleteSurvey(id)) // TODO: action
  })
)(ManageSurveyButton);

export { ManageSurveyButton };
export default ManageSurveyButtonContainer;
