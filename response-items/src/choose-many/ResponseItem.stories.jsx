import Icon from "./Icon";
import ResponseItem from "./ResponseItem";

export default {
  title: "Choose Many",
  component: ResponseItem,
  argTypes: {
    alignment: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
    },
    textColor: { control: { type: "color" } },
    colorScheme: {
      options: ["red", "green", "blue", "yellow"],
      control: { type: "radio" },
    },
    minChecks: { control: "number" },
    maxChecks: { control: "number" },
    logResults: { action: "logResults" },
    clearResult: { action: "clearResult" },
    setIsValidResponse: { action: "setIsValidResponse" },
  },
  args: {
    option0: "Option 0",
    option1: "Option 1",
    option2: "Option 2",
    option3: "Option 3",
    confirmed: false,
    minChecks: 0,
    maxChecks: 4,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
