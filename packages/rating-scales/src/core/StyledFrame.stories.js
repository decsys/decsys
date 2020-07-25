import React from "react";
import StyledFrame from "./StyledFrame";

export default {
  title: "core/StyledFrame",
  component: StyledFrame,
};

export const Basic = () => <StyledFrame style={{ background: "red" }} />;
