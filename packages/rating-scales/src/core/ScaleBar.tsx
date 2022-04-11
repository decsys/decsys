/** @jsx jsx */
import { jsx } from "@emotion/react";
import {
  forwardRef,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from "react";

/**
 * Simply provides a container for children of a ScaleBar
 * that will be evenly spaced out using flexbox
 */
export const FlexContainer = ({
  style,
  ...p
}: ComponentPropsWithoutRef<"div">) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      ...style,
    }}
    {...p}
  />
);

export interface ScaleBarProps extends ComponentPropsWithRef<"div"> {
  /** A valid CSS Dimension value for the bar left margin. */
  leftMargin?: string;

  /** A valid CSS Dimension value for the bar right margin. */
  rightMargin?: string;

  /** A valid CSS Dimension value for the bar top margin. */
  topMargin?: string;

  /** A valid CSS Color value for the bar color. */
  barColor?: string;

  /** A valid CSS Dimension value for the bar thickness. */
  thickness?: string;
}

/**
 * A reusable scale bar, that can be styled and contain further
 * scale components such as radio buttons, markers, labels etc.
 */
export const ScaleBar = forwardRef<HTMLDivElement, ScaleBarProps>(
  function ScaleBar(
    {
      leftMargin = "10%",
      rightMargin = "10%",
      topMargin = "50%",
      thickness = "0.2em",
      barColor = "black",
      ...p
    }: ScaleBarProps,
    ref
  ) {
    return (
      <div
        css={{
          marginLeft: leftMargin,
          marginRight: rightMargin,
          position: "relative",
          top: topMargin,
          "&::before": {
            borderTop: `${thickness} solid ${barColor}`,
            content: '""',
            position: "absolute",
            top: `calc(${thickness} / -2)`,
            width: "100%",
            zIndex: 1,
          },
        }}
        ref={ref}
        {...p}
      />
    );
  }
);
