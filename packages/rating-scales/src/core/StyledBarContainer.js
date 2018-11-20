import styled from "styled-components";

/**
 * Simply provides a container for children of a ScaleBar
 * that will be evenly spaced out using flexbox
 */
const StyledBarContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

/** @component */
export default StyledBarContainer;
