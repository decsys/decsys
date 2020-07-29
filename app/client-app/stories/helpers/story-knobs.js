import { optionsKnob } from "@storybook/addon-knobs";

export const themeVariantsKnob = (label, theme) =>
  optionsKnob(
    label,
    Object.keys(theme.colors).reduce((a, v) => {
      a[v] = v;
      return a;
    }, {}),
    "info",
    { display: "select" }
  );
