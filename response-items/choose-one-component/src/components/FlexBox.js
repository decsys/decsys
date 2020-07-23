import React from "react";
import styled from "styled-components";

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${x => {
    switch(x.alignment)
    {
      case "left": return "flex-start";
      case "right": return "flex-end";
      default: return "center";
    }
  }};
`;

export default FlexBox;