import React, { useState, useEffect, forwardRef } from "react";
import { Button } from "@smooth-ui/core-sc";

const calculateToggleStyle = (on, variant) => {
  if (on)
    // use a standard full button
    return {
      variant,
      border: 1,
      borderColor: variant
    };
  // use an outlined button in the variant colors
  else
    return {
      variant: "light",
      color: variant,
      border: 1,
      borderColor: variant,
      backgroundColor: "lightest"
    };
};

const ToggleButton = forwardRef(
  ({ variant = "primary", checked, children, onClick, ...p }, ref) => {
    const [on, setOn] = useState(checked);
    const [toggleStyle, setToggleStyle] = useState(
      calculateToggleStyle(checked, variant)
    );

    useEffect(() => setToggleStyle(calculateToggleStyle(on, variant)), [
      on,
      variant
    ]);

    const handleClick = e => {
      e.target.checked = !on;
      setOn(!on);
      onClick(e);
    };

    return (
      <Button ref={ref} {...toggleStyle} {...p} onClick={handleClick}>
        {children}
      </Button>
    );
  }
);

export default ToggleButton;
