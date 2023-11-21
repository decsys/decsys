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
    fontFamily: { control: "text" },
    defaultChecked: { control: "boolean" },
    fontSize: { control: "text" },
    labelAbove: { control: "boolean" },
    secondaryLabel: { control: "text" },
  },
};

export const Basic = (args) => <Radio {...args} />;

export const LabeledRadio = () => (
  <Radio label="opt1" value="Option 1" id="option-1" />
);

export const StyledRadio = () => (
  <Radio
    label="custom"
    value="1"
    id="custom-style"
    labelColor="Blue"
    fontFamily="Helvetica"
    secondaryLabel="Custom Label"
  />
);
