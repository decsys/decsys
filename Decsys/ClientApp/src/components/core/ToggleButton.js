import React, { forwardRef, useState } from "react";
import { Button } from "@chakra-ui/core";

const ToggleButton = forwardRef(
  ({ defaultChecked, children, onClick, ...p }, ref) => {
    const [isOn, setIsOn] = useState(defaultChecked);

    const handleClick = e => {
      setIsOn(!isOn);
      e.target.checked = !isOn;
      onClick(e);
    };

    return (
      <Button
        ref={ref}
        variant={isOn ? "solid" : "outline"}
        {...p}
        onClick={handleClick}
      >
        {children}
      </Button>
    );
  }
);

export default ToggleButton;
