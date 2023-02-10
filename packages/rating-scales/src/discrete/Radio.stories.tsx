import { Radio, RadioProps } from "./Radio";

export default {
  title: "Discrete/Radio",
  component: Radio,
  decorators: [
    (Story) => (
      <div style={{ margin: "100px", width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const Basic = (args: RadioProps) => <Radio {...args} />;
Basic.args = {
  index: 0,
  value: "1",
  id: "radio",
};
