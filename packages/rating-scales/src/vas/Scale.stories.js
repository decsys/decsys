import { Scale } from "./Scale";
import Frame from "../core/Frame";
import { action } from "@storybook/addon-actions";
import { useArgs } from "@storybook/client-api";

export default {
  title: "VAS + MVAS/VAS Scale",
  component: Scale,
};

export const Basic = (args) => {
  const [{ value }, updateArgs] = useArgs();

  args = {
    ...args,
    value,
    onChange: (v) => {
      updateArgs({ value: v });
      action("VAS Completed")(v);
    },
  };

  return (
    <Frame frameHeight="300px">
      <Scale {...args} />
      <input
        style={{ border: "thin solid grey" }}
        value={value}
        onChange={(e) =>
          updateArgs({
            value: e.target.value ? parseFloat(e.target.value) : null,
          })
        }
      />
    </Frame>
  );
};
Basic.args = { value: 4 };
