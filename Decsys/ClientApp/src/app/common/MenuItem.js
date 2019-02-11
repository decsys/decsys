import React from "react";
import { Button } from "@smooth-ui/core-sc";

const MenuItem = props => (
  <Button
    display="block"
    variant="light"
    borderRadius={0}
    textAlign="left"
    {...props}
  />
);

export default MenuItem;
