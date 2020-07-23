import React from "react";
import MenuItem from "./MenuItem";
import { useNavigation } from "react-navi";

/**
 * A dropdown menu item used to change the app's route using Navi
 *
 * - `onClick` cannot be overridden.
 * - `href` must be specified as with Navi's `Link`.
 * - all other props are passed onto the underlying `MenuItem`.
 */
const MenuRouterLink = ({ onClick, href, ...rest }) => {
  const navigation = useNavigation();
  return <MenuItem onClick={() => navigation.navigate(href)} {...rest} />;
};

export default MenuRouterLink;
