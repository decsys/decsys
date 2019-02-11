import React from "react";
import DropdownMenuButton from "../../common/DropdownMenuButton";
import MenuItem from "../../common/MenuItem";
import MenuRouterLink from "../../common/MenuRouterLink";

const ManageSurveyButton = ({ runCount, id }) => (
  <DropdownMenuButton button="Manage">
    {runCount <= 0 ? (
      <MenuRouterLink to={`survey/${id}`}>Edit</MenuRouterLink>
    ) : null}
    <MenuRouterLink to={`survey/${id}/preview`}>Preview</MenuRouterLink>
    <MenuRouterLink to={`survey/${id}/export`}>Export</MenuRouterLink>
    <MenuItem onClick={() => alert("TODO complete action")}>Duplicate</MenuItem>
    <MenuItem onClick={() => alert("TODO confirm modal")}>Delete</MenuItem>
  </DropdownMenuButton>
);

export default ManageSurveyButton;
