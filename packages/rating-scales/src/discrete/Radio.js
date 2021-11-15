import PropTypes from "prop-types";
import { labelDistance } from "../constants";

const labelPropTypes = {
  /** A valid CSS Color value for the label text. */
  labelColor: PropTypes.string.isRequired,
  /** A valid CSS Font Family value for the label text. */
  fontFamily: PropTypes.string.isRequired,
  /** A valid CSS Font Size value for the label text. */
  fontSize: PropTypes.string.isRequired,
  /** Whether the label is above or below the radio button. */
  above: PropTypes.bool,
};

/**
 * A styled label that can be above or below a radio button.
 */
const RadioLabel = ({ labelColor, fontFamily, fontSize, above, ...p }) => (
  <label
    css={{
      color: labelColor,
      fontFamily,
      fontSize,
      marginLeft: "0.6rem",
      position: "absolute",
      left: above ? "0" : "0.05em",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      marginTop: above ? `calc(${labelDistance} * -1)` : labelDistance,
    }}
    {...p}
  />
);
RadioLabel.propTypes = labelPropTypes;

/**
 * A styled label that can be above or below a radio button.
 *
 * It's intended for use as a secondary label, further from the scale bar.
 */
const SecondaryRadioLabel = ({ above, ...p }) => (
  <RadioLabel
    css={{
      marginTop: above
        ? `calc(${labelDistance} * -2)`
        : `calc(${labelDistance} * 2)`,
    }}
    {...p}
  />
);
SecondaryRadioLabel.propTypes = labelPropTypes;

/**
 * A styled radio button input
 */
const RadioInput = (p) => (
  <input type="radio" name="discrete" css={{ transform: "scale(2)" }} {...p} />
);

/**
 * A styled containing div for a single labelled radio button
 */
const RadioContainer = (p) => (
  <div css={{ position: "relative", zIndex: 1, top: "-0.55em" }} {...p} />
);

/**
 * A Labelled Radio Button component for use on the Discrete Scale
 */
const Radio = ({
  index,
  value,
  id,
  labelColor,
  fontFamily,
  fontSize,
  defaultChecked,
  labelAbove,
  secondaryLabel,
}) => {
  const handleRadioClick = () => {
    document.dispatchEvent(
      new CustomEvent("DiscreteSelected", {
        detail: {
          index,
          value,
        },
      })
    );
  };

  const label = (
    <RadioLabel
      labelColor={labelColor}
      fontFamily={fontFamily}
      fontSize={fontSize}
      above={labelAbove}
      htmlFor={id}
    >
      {value}
    </RadioLabel>
  );

  const secondaryLabelComponent = secondaryLabel ? (
    <SecondaryRadioLabel
      labelColor={labelColor}
      fontFamily={fontFamily}
      fontSize={fontSize}
      above={labelAbove}
      htmlFor={id}
    >
      {secondaryLabel}
    </SecondaryRadioLabel>
  ) : null;

  return (
    <RadioContainer>
      {labelAbove && secondaryLabelComponent}
      {labelAbove && label}
      <RadioInput
        id={id}
        value={value}
        onClick={handleRadioClick}
        defaultChecked={defaultChecked}
      />
      {!labelAbove && label}
      {!labelAbove && secondaryLabelComponent}
    </RadioContainer>
  );
};

Radio.propTypes = {
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
  secondaryLabel: PropTypes.string,
};
Radio.defaultProps = {
  labelColor: "black",
  fontFamily: "Arial",
  fontSize: "1.2em",
  labelAbove: false,
};

export { Radio };
