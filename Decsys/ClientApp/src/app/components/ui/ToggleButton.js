import React, { useState, useEffect } from "react";
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

const ToggleButton = ({
  variant = "primary",
  checked,
  children,
  onClick,
  ...p
}) => {
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
    <Button {...toggleStyle} {...p} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default ToggleButton;
