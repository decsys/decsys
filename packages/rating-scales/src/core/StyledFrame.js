import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * A containing frame for a scale component.
 *
 * This component sets a base CSS font-size which many relative values
 * (`em`, `rem`, `%`) in sub-components are based on
 */
const StyledFrame = styled.div`
  height: ${props => props.frameHeight};
  width: 100%;
  position: relative;
  font-size: 14px;
`;

StyledFrame.propTypes = {
  /** A valid CSS Dimension value for the height of the Frame. */
  frameHeight: PropTypes.string
};

StyledFrame.defaultProps = {
  frameHeight: "400px"
};

/** @component */
export default StyledFrame;
