import PropTypes from "prop-types";

/**
 * A reusable question component for a scale component.
 */
const Question = ({
  textColor,
  topMargin,
  fontFamily,
  fontSize,
  xAlign,
  xMargin,
  ...p
}) => {
  const xAlignStyles = (() => {
    switch (xAlign) {
      case "center":
        return { width: "inherit", margin: "auto", transform: "unset" };
      case "right":
        return {
          width: "inherit",
          margin: "auto",
          transform: `translate(calc(${xMargin} * -1))`,
        };
      default:
        return { width: "initial", margin: `0 ${xMargin}`, transform: "unset" };
    }
  })();

  return (
    <div
      css={{
        color: textColor,
        position: "absolute",
        top: topMargin,
        fontFamily,
        fontSize,
        textAlign: xAlign,
        ...xAlignStyles,
      }}
      {...p}
    />
  );
};

export const questionPropTypes = {
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
  xAlign: PropTypes.oneOf(["left", "center", "right"]),
};

Question.propTypes = questionPropTypes;
Question.defaultProps = {
  textColor: "black",
  topMargin: "10%",
  xMargin: "5%",
  fontFamily: "Arial",
  fontSize: "1.6em",
  xAlign: "left",
};

/** @component */
export default Question;
