import React, { forwardRef } from "react";
import { Button } from "@chakra-ui/core";

const ToggleButton = ({ checked, children, onClick, ...p }, ref) => {
  const handleClick = e => {
    e.target.checked = !checked;
    onClick(e);
  };

  return (
    <Button
      ref={ref}
      variant={checked ? "solid" : "outline"}
      {...p}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default forwardRef(ToggleButton);
