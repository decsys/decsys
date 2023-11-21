import { Scale } from "./Scale";
import { Frame } from "../core/Frame";
import { useArgs } from "@storybook/client-api";

export default {
  title: "VAS + MVAS/VAS Scale",
  component: Scale,
  argTypes: {
    onChange: { action: "Vas Completed" },
  },
};

export const Basic = (args) => {
  const [{ value }, updateArgs] = useArgs();

  const handleChange = (v) => {
    updateArgs({ value: v });
    args.onChange(v);
  };

  return (
    <Frame frameHeight="300px">
      <Scale {...args} onChange={handleChange} />
      <input
        style={{ border: "thin solid grey" }}
        value={value}
        onChange={(e) =>
          handleChange(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
    </Frame>
  );
};
Basic.args = { value: 4 };
