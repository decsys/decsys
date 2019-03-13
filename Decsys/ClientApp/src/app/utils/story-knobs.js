import { optionsKnob } from "@storybook/addon-knobs";

export const colorsKnob = (label, theme) =>
  optionsKnob(
    label,
    Object.keys(theme.colors).reduce((a, v) => {
      a[v] = v;
      return a;
    }, {}),
    "info",
    { display: "inline-radio" }
  );
