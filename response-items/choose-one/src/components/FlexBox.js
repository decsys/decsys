import React from "react";

const FlexBox = ({ alignment, ...p }) => {
  const alignItems =
    {
      left: "flex-start",
      right: "flex-end",
    }[alignment] ?? "center";

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems,
      }}
      {...p}
    />
  );
};

export default FlexBox;
