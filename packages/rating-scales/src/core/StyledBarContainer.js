import React from "react";

/**
 * Simply provides a container for children of a ScaleBar
 * that will be evenly spaced out using flexbox
 */
const StyledBarContainer = (p) => (
  <div
    css={{
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    }}
    {...p}
  ></div>
);

/** @component */
export default StyledBarContainer;
