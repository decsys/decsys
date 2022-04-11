import { ComponentPropsWithoutRef } from "react";

export interface QuestionProps extends ComponentPropsWithoutRef<"div"> {
  /** A valid CSS Color value for the question color. */
  textColor?: string;

  /** A valid CSS Dimension value for the question top margin. */
  topMargin?: string;

  /**
   * A valid CSS Dimension value for the question left or right margin.
   *
   * The use of this value depends on alignment. It is ignored for `center` alignment,
   * otherwise it is used as a margin on the aligned side (`left` or `right`).
   */
  xMargin?: string;

  /** A valid CSS Font Family value for the question font. */
  fontFamily?: string;

  /** A valid CSS Font Size value for the question font size. */
  fontSize?: string;

  /** Text alignment of the question within the frame. */
  xAlign?: "left" | "center" | "right";
}

/**
 * A reusable question component for a scale component.
 */
export const Question = ({
  textColor = "black",
  topMargin = "10%",
  xMargin = "5%",
  fontFamily = "Arial",
  fontSize = "1.6em",
  xAlign = "left",
  ...p
}: QuestionProps) => {
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
      style={{
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
