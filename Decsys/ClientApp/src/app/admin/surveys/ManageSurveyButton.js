import React from "react";
import { connect } from "react-redux";
import DropdownMenuButton from "../../common/DropdownMenuButton";
import MenuItem from "../../common/MenuItem";
import MenuRouterLink from "../../common/MenuRouterLink";
import { DuplicateSurvey, DeleteSurvey } from "./_actions";

let ManageSurveyButton = ({
  runCount,
  id,
  onDuplicateClick,
  onDeleteClick
}) => (
  <DropdownMenuButton button="Manage">
    {runCount <= 0 ? (
      <MenuRouterLink to={`survey/${id}`}>Edit</MenuRouterLink>
    ) : null}
    <MenuRouterLink to={`survey/${id}/preview`}>Preview</MenuRouterLink>
    <MenuRouterLink to={`survey/${id}/export`}>Export</MenuRouterLink>
    <MenuItem onClick={onDuplicateClick}>Duplicate</MenuItem>
    <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
  </DropdownMenuButton>
);

ManageSurveyButton = connect(
  null,
  (dispatch, { id }) => ({
    onDuplicateClick: () => dispatch(DuplicateSurvey(id)),
    onDeleteClick: () => dispatch(DeleteSurvey(id))
  })
)(ManageSurveyButton);

export default ManageSurveyButton;
