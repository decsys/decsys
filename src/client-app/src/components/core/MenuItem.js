import React from "react";
import { Button } from "@smooth-ui/core-sc";

/**
 * A clickable item for a dropdown menu.
 *
 * Passes props onto the underlying `Button`.
 */
const MenuItem = props => (
  <Button
    display="block"
    variant="menuItem"
    borderRadius={0}
    textAlign="left"
    {...props}
  />
);

export default MenuItem;
