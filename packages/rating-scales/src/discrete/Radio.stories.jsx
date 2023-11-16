import { Radio } from "./Radio";

export default {
  title: "Discrete/Radio",
  component: Radio,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ margin: "100px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    index: { control: "number" },
    value: { control: "text" },
    id: { control: "text" },
    labelColor: { control: "color" },
    barColor: { control: "color" },
    fontFamily: { control: "text" },
    defaultChecked: { control: "boolean" },
    fontSize: { control: "text" },
    labelAbove: { control: "boolean" },
    secondaryLabel: { control: "text" },
  },
};

export const Basic = (args) => <Radio {...args} />;
Basic.args = {
  index: 0,
  value: "1",
  id: "radio",
};
