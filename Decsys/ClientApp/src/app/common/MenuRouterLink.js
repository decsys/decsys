import React from "react";
import { Route } from "react-router-dom";
import MenuItem from "./MenuItem";

const MenuRouterLink = props => (
  <Route
    render={({ history }) => (
      <MenuItem onClick={() => history.push(props.to)} {...props} />
    )}
  />
);

export default MenuRouterLink;
