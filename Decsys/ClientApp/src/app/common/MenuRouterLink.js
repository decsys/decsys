import React from "react";
import { Route } from "react-router-dom";
import MenuItem from "./MenuItem";

const MenuRouterLink = ({ onClick, to, ...rest }) => (
  <Route
    render={({ history }) => (
      <MenuItem onClick={() => history.push(to)} {...rest} />
    )}
  />
);

export default MenuRouterLink;
