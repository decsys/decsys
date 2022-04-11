import { ComponentPropsWithoutRef } from "react";

interface FrameProps extends ComponentPropsWithoutRef<"div"> {
  /** A valid CSS Dimension value for the height of the Frame. */
  frameHeight: string;
}

/**
 * A containing frame for a scale component.
 *
 * This component sets a base CSS font-size which many relative values
 * (`em`, `rem`, `%`) in sub-components are based on
 */
export const Frame = ({ frameHeight = "400px", style, ...p }: FrameProps) => (
  <div
    style={{
      minHeight: frameHeight,
      height: frameHeight,
      width: "100%",
      position: "relative",
      fontSize: "14px",
      userSelect: "none",
      ...style,
    }}
    {...p}
  />
);
