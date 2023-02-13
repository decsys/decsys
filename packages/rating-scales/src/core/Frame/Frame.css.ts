import { style } from "@vanilla-extract/css";

const frameHeight = "300px"; // TODO: prop

export const frame = style({
  minHeight: frameHeight,
  height: frameHeight,
  width: "100%",
  position: "relative",
  fontSize: "14px",
  userSelect: "none",
  backgroundColor: "red", // TODO: remove
  // TODO: further styles from props?
});
