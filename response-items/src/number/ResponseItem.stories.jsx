import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Number",
  component: ResponseItem,
  argTypes: {
    defaultValue: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    precision: { control: "number" },
    setIsValidResponse: { action: "Next button toggled" },
    logResults: { action: "Results logged" },
  },
  args: {
    defaultValue: 0,
    min: 0,
    max: 100,
    precision: 0,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};
