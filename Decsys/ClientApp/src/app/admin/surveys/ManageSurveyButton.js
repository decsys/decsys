import React from "react";
import DropdownMenuButton from "../../common/DropdownMenuButton";
import MenuItem from "../../common/MenuItem";
import MenuRouterLink from "../../common/MenuRouterLink";

const ManageSurveyButton = ({ runCount, id }) => (
  <DropdownMenuButton button="Manage">
    {runCount <= 0 ? (
      <MenuRouterLink to={`survey/${id}`}>Edit</MenuRouterLink>
    ) : null}
    <MenuItem onClick={() => alert("TODO confirm modal")}>Delete</MenuItem>
  </DropdownMenuButton>
);

export default ManageSurveyButton;
