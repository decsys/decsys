import React from "react";
import { Route } from "react-router-dom";
import MenuItem from "./MenuItem";

/**
 * A dropdown menu item used to change the app's route using React Router
 *
 * - `onClick` cannot be overridden.
 * - `to` must be specified as with React Router's `Link`.
 * - all other props are passed onto the underlying `MenuItem`.
 */
const MenuRouterLink = ({ onClick, to, ...rest }) => (
  <Route
    render={({ history }) => (
      <MenuItem onClick={() => history.push(to)} {...rest} />
    )}
  />
);

export default MenuRouterLink;
