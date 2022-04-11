import { ComponentPropsWithoutRef } from "react";
import { labelDistance } from "../constants";

// TODO: work out a sensible way to write stories for this
// cos there's some complex alignment shenanigans going on.
// do it on a Scalebar, I guess?

/** A point a label is relative to */
const LabelPoint = ({ style, ...p }: ComponentPropsWithoutRef<"div">) => (
  <div style={{ position: "relative", ...style }} {...p} />
);

interface BarLabelProps extends ComponentPropsWithoutRef<"label"> {
  /** A valid CSS Color value for the label text */
  labelColor: string;

  /** A valid CSS Font Family value for any labels associated with this Radio component. */
  fontFamily: string;

  /** A valid CSS Font Size value for any labels associated with this Radio component. */
  fontSize: string;

  /** Vertical alignment of the label relative to its position */
  yAlign: "above" | "center" | "below";

  /**
   * The index of the position of the label relative to the Scale Bar.
   * 0 - hard left, 1 - center, 2 - hard right
   */
  labelIndex: number;
}

/** A label at a position */
const BarLabel = ({
  labelColor = "black",
  fontFamily = "Arial",
  fontSize = "1.2em",
  labelIndex = 0,
  yAlign = "below",
  style,
  ...p
}: BarLabelProps) => {
  const left = yAlign === "below" ? "0.05em" : "0";

  let transform: string;
  let yTransform = "";
  if (yAlign === "center") {
    yTransform = "translateY(-50%)";
    transform = {
      // 0 and 2 are the left and rightmost labels
      0: `${yTransform} translateX(calc(-100% + ${labelDistance} * -1))`,
      2: `${yTransform} translateX(${labelDistance})`,
    }[labelIndex];
  }
  transform = transform || `${yTransform} translateX(-50%)`;

  const marginTop = {
    above: `calc(${labelDistance} * -1)`,
    center: 0,
    below: labelDistance,
  }[yAlign];

  return (
    <label
      style={{
        color: labelColor,
        fontFamily,
        fontSize,
        marginLeft: 0,
        position: "absolute",
        left,
        transform,
        whiteSpace: "nowrap",
        marginTop,
        ...style,
      }}
      {...p}
    />
  );
};

export interface ScaleLabelProps extends BarLabelProps {
  /** The actual label text */
  value: string;
}

/** A positionable label for a ScaleBar */
export const ScaleLabel = ({ value, ...p }: ScaleLabelProps) => (
  <LabelPoint>
    <BarLabel {...p}>{value}</BarLabel>
  </LabelPoint>
);
