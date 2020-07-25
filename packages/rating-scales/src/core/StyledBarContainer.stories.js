import React from "react";
import StyledBarContainer from "./StyledBarContainer";

export default {
  title: "core/StyledBarContainer",
  component: StyledBarContainer,
};

export const Basic = () => (
  <StyledBarContainer style={{ background: "red", height: "50px" }} />
);
