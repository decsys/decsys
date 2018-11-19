import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * A reusable question component for a scale component.
 */
const StyledQuestion = styled.div`
  color: ${props => props.textColor};
  position: absolute;
  top: ${props => props.topMargin};
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize};
  text-align: ${props => props.xAlign}
  width: ${props => {
    switch (props.xAlign) {
      case "center":
      case "right":
        return "inherit";
      default:
        return "initial";
    }
  }};
  margin: ${props => {
    switch (props.xAlign) {
      case "center":
      case "right":
        return "auto";
      default:
        return `0 ${props.xMargin}`;
    }
  }};
  transform: ${props => {
    switch (props.xAlign) {
      case "right":
        return `translate(calc(${props.xMargin} * -1))`;
      default:
        return "unset";
    }
  }};
`;

StyledQuestion.propTypes = {
  /** A valid CSS Color value for the question color. */
  textColor: PropTypes.string,

  /** A valid CSS Dimension value for the question top margin. */
  topMargin: PropTypes.string,

  /**
   * A valid CSS Dimension value for the question left or right margin.
   *
   * The use of this value depends on alignment. It is ignored for `center` alignment,
   * otherwise it is used as a margin on the aligned side (`left` or `right`).
   */
  xMargin: PropTypes.string,

  /** A valid CSS Font Family value for the question font. */
  fontFamily: PropTypes.string,

  /** A valid CSS Font Size value for the question font size. */
  fontSize: PropTypes.string,

  /** Text alignment of the question within the frame. */
  xAlign: PropTypes.oneOf(["left", "center", "right"])
};

StyledQuestion.defaultProps = {
  textColor: "black",
  topMargin: "10%",
  xMargin: "5%",
  fontFamily: "Arial",
  fontSize: "1.6em",
  xAlign: "left"
};

/** @component */
export default StyledQuestion;
