import React from "react";
import StyledBarContainer from "./StyledBarContainer";

export default {
  title: "core/StyledBarContainer",
  component: StyledBarContainer,
};

export const Basic = () => (
  <StyledBarContainer style={{ background: "red", height: "50px" }} />
);

export const WithChildren = () => (
  <StyledBarContainer>
    {[1, 2, 3].map((n) => (
      <div style={{ marginTop: `${n}0px` }} key={n}>
        {n}
      </div>
    ))}
  </StyledBarContainer>
);
