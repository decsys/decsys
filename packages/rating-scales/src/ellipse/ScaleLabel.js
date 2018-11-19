import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

const labelDistance = "2.8rem";

/** A point a label is relative to */
const LabelPoint = styled.div`
  position: relative;
`;

/** A label at a position */
const BarLabel = styled.label`
  color: ${props => props.labelColor};
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize};
  margin-left: 0;
  position: absolute;
  left: ${props => {
    switch (props.yAlign) {
      case "below":
        return "0.05em";
      default:
        return "0";
    }
  }};
  transform: ${props => {
    let yTransform = "";
    // specific cases
    if (props.yAlign === "center") {
      yTransform = "translateY(-50%)";
      switch (props.labelIndex) {
        case 0: // min label (left)
          return `${yTransform} translateX(calc(-100% + ${labelDistance} * -1))`;
        case 2: // max label (right)
          return `${yTransform} translateX(${labelDistance})`;
      }
    }

    // Default
    return `${yTransform} translateX(-50%)`;
  }};
  white-space: nowrap;
  margin-top: ${props => {
    switch (props.yAlign) {
      case "above":
        return `calc(${labelDistance} * -1)`;
      case "center":
        return "0";
      case "below":
        return labelDistance;
    }
  }};
`;

BarLabel.propTypes = {
  /** A valid CSS Color value for the label text */
  labelColor: PropTypes.string,

  /** A valid CSS Font Family value for any labels associated with this Radio component. */
  fontFamily: PropTypes.string,

  /** A valid CSS Font Size value for any labels associated with this Radio component. */
  fontSize: PropTypes.string,

  /** Vertical alignment of the label relative to its position */
  yAlign: PropTypes.oneOf(["above", "center", "below"]),

  /**
   * The index of the position of the label relative to the Scale Bar.
   * 0 - hard left, 1 - center, 2 - hard right
   */
  labelIndex: PropTypes.number
};

BarLabel.defaultProps = {
  labelColor: "black",
  fontFamily: "Arial",
  fontSize: "1.2em",
  labelIndex: 0
};

/** A positionable label for a ScaleBar */
export default class ScaleLabel extends React.Component {
  static propTypes = {
    /** The actual label text */
    value: PropTypes.string.isRequired,

    /** A valid CSS Color value for the label text */
    labelColor: PropTypes.string,

    /** A valid CSS Font Family value for any labels associated with this Radio component. */
    fontFamily: PropTypes.string,

    /** A valid CSS Font Size value for any labels associated with this Radio component. */
    fontSize: PropTypes.string,

    /** Vertical alignment of the label relative to its position */
    yAlign: PropTypes.oneOf(["above", "center", "below"]),

    /**
     * The index of the position of the label relative to the Scale Bar.
     * 0 - hard left, 1 - center, 2 - hard right
     */
    labelIndex: PropTypes.number
  };

  render() {
    return (
      <LabelPoint>
        <BarLabel {...this.props}>{this.props.value}</BarLabel>
      </LabelPoint>
    );
  }
}
