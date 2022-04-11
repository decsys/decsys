import { ComponentPropsWithoutRef } from "react";
import { labelDistance } from "../constants";

interface RadioLabelProps extends ComponentPropsWithoutRef<"label"> {
  /** A valid CSS Color value for the label text. */
  labelColor: string;
  /** A valid CSS Font Family value for the label text. */
  fontFamily: string;
  /** A valid CSS Font Size value for the label text. */
  fontSize: string;
  /** Whether the label is above or below the radio button. */
  above: boolean;
}

/**
 * A styled label that can be above or below a radio button.
 */
const RadioLabel = ({
  labelColor,
  fontFamily,
  fontSize,
  above,
  style,
  ...p
}: RadioLabelProps) => (
  <label
    style={{
      color: labelColor,
      fontFamily,
      fontSize,
      marginLeft: "0.6rem",
      position: "absolute",
      left: above ? "0" : "0.05em",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      marginTop: above ? `calc(${labelDistance} * -1)` : labelDistance,
      ...style,
    }}
    {...p}
  />
);

/**
 * A styled label that can be above or below a radio button.
 *
 * It's intended for use as a secondary label, further from the scale bar.
 */
const SecondaryRadioLabel = ({ style, ...p }: RadioLabelProps) => (
  <RadioLabel
    style={{
      marginTop: p.above
        ? `calc(${labelDistance} * -2)`
        : `calc(${labelDistance} * 2)`,
      ...style,
    }}
    {...p}
  />
);

/**
 * A styled radio button input
 */
const RadioInput = ({ style, ...p }: ComponentPropsWithoutRef<"input">) => (
  <input
    type="radio"
    name="discrete"
    style={{ transform: "scale(2)", ...style }}
    {...p}
  />
);

/**
 * A styled containing div for a single labelled radio button
 */
const RadioContainer = ({ style, ...p }: ComponentPropsWithoutRef<"div">) => (
  <div
    style={{ position: "relative", zIndex: 1, top: "-0.55em", ...style }}
    {...p}
  />
);

export interface RadioProps {
  /** The index of this Radio component in an array of Radio components. */
  index: number;

  /** The value of this Radio component. */
  value: string;

  /** Value to be used as the RadioInput's id. */
  id: string;

  /** CSS Color value for any labels associated with this Radio component. */
  labelColor?: string;

  /** A valid CSS Font Family value for any labels associated with this Radio component. */
  fontFamily?: string;

  /** A valid CSS Font Size value for any labels associated with this Radio component. */
  fontSize?: string;

  /** Whether the RadioInput should default to being checked. */
  defaultChecked: boolean;

  /** Whether RadioLabels should be above or below the RadioInput. */
  labelAbove: boolean;

  /** Optional text for a secondary label */
  secondaryLabel: string;
}

/**
 * A Labelled Radio Button component for use on the Discrete Scale
 */
const Radio = ({
  index,
  value,
  id,
  labelColor = "black",
  fontFamily = "Arial",
  fontSize = "1.2em",
  defaultChecked,
  labelAbove = false,
  secondaryLabel,
}: RadioProps) => {
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

export { Radio };
