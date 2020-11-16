import Radio from "./Radio";
import { boolean, text } from "@storybook/addon-knobs";

export default {
  title: "Discrete/Radio",
  component: Radio,
  decorators: [
    (s) => <div style={{ margin: "100px", width: "100%" }}>{s()}</div>,
  ],
};

export const Basic = () => <Radio index={0} value="" id="radio" />;

export const WithKnobs = () => (
  <Radio
    fontFamily={text("Font Family", Radio.defaultProps.fontFamily)}
    fontSize={text("Font Size", Radio.defaultProps.fontSize)}
    id={text("Id", "my-radio")}
    index={0}
    labelAbove={boolean("Labels Above", Radio.defaultProps.labelAbove)}
    labelColor={text("Label Color", Radio.defaultProps.labelColor)}
    secondaryLabel={text("Secondary Label Text", "")}
    value={text("Value", "Value")}
  />
);
