import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

const labelDistance = "2.8rem";

/**
 * A styled label that can be above or below a radio button.
 */
const RadioLabel = styled.label`
  color: ${props => props.labelColor};
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize};
  margin-left: 0.6rem;
  position: absolute;
  left: ${props => (props.above ? "0" : "0.05em")};
  transform: translateX(-50%);
  white-space: nowrap;
  margin-top: ${props =>
    props.above ? `calc(${labelDistance} * -1)` : labelDistance};
`;
RadioLabel.propTypes = {
  /** A valid CSS Color value for the label text. */
  labelColor: PropTypes.string.isRequired,
  /** A valid CSS Font Family value for the label text. */
  fontFamily: PropTypes.string.isRequired,
  /** A valid CSS Font Size value for the label text. */
  fontSize: PropTypes.string.isRequired,
  /** Whether the label is above or below the radio button. */
  above: PropTypes.bool
};

/**
 * A styled label that can be above or below a radio button.
 *
 * It's intended for use as a secondary label, further from the scale bar.
 */
const SecondaryRadioLabel = styled(RadioLabel)`
  margin-top: ${props =>
    props.above ? `calc(${labelDistance} * -2)` : `calc(${labelDistance} * 2)`};
`;

/**
 * A styled radio button input
 */
const RadioInput = styled.input.attrs({
  type: "radio",
  name: "discrete"
})`
  transform: scale(2);
`;

/**
 * A styled containing div for a single labelled radio button
 */
const RadioContainer = styled.div`
  position: relative;
  z-index: 1;
  top: -0.55em;
`;

/**
 * A Labelled Radio Button component for use on the Discrete Scale
 */
export default class Radio extends React.Component {
  static propTypes = {
    /** The index of this Radio component in an array of Radio components. */
    index: PropTypes.number.isRequired,

    /** The value of this Radio component. */
    value: PropTypes.string.isRequired,

    /** Value to be used as the RadioInput's id. */
    id: PropTypes.string.isRequired,

    /** CSS Color value for any labels associated with this Radio component. */
    labelColor: PropTypes.string,

    /** A valid CSS Font Family value for any labels associated with this Radio component. */
    fontFamily: PropTypes.string,

    /** A valid CSS Font Size value for any labels associated with this Radio component. */
    fontSize: PropTypes.string,

    /** Whether the RadioInput should default to being checked. */
    defaultChecked: PropTypes.bool,

    /** Whether RadioLabels should be above or below the RadioInput. */
    labelAbove: PropTypes.bool,

    /** Optional text for a secondary label */
    secondaryLabel: PropTypes.string
  };

  static defaultProps = {
    labelColor: "black",
    fontFamily: "Arial",
    fontSize: "1.2em",
    labelAbove: false
  };

  radioClickHandler = () => {
    document.dispatchEvent(
      new CustomEvent("DiscreteSelected", {
        detail: {
          index: this.props.index,
          value: this.props.value
        }
      })
    );
  };

  render() {
    const label = (
      <RadioLabel
        labelColor={this.props.labelColor}
        fontFamily={this.props.fontFamily}
        fontSize={this.props.fontSize}
        above={this.props.labelAbove}
        htmlFor={this.props.id}
      >
        {this.props.value}
      </RadioLabel>
    );

    const secondaryLabel = this.props.secondaryLabel ? (
      <SecondaryRadioLabel
        labelColor={this.props.labelColor}
        fontFamily={this.props.fontFamily}
        fontSize={this.props.fontSize}
        above={this.props.labelAbove}
        htmlFor={this.props.id}
      >
        {this.props.secondaryLabel}
      </SecondaryRadioLabel>
    ) : null;

    return (
      <RadioContainer>
        {this.props.labelAbove && secondaryLabel}
        {this.props.labelAbove && label}
        <RadioInput
          id={this.props.id}
          value={this.props.value}
          onClick={this.radioClickHandler}
          defaultChecked={this.props.defaultChecked}
        />
        {!this.props.labelAbove && label}
        {!this.props.labelAbove && secondaryLabel}
      </RadioContainer>
    );
  }
}
