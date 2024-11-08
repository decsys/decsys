import Icon from "./Icon";
import ResponseItem from "./ResponseItem";

export default {
  title: "Choose Many",
  component: ResponseItem,
  argTypes: {
    // Min Max Checks
    minChecks: { control: "number" },
    maxChecks: { control: "number" },

    // Qualitative Options
    option0: { control: "text" },
    option1: { control: "text" },
    option2: { control: "text" },
    option3: { control: "text" },
    option4: { control: "text" },
    option5: { control: "text" },
    option6: { control: "text" },

    // Styling Options
    alignment: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
    },
    textColor: { control: { type: "color" } },
    colorScheme: {
      options: ["red", "green", "blue", "yellow"],
      control: { type: "radio" },
    },
    fontSize: { control: "text" },
    fontFamily: { control: "text" },

    // Actions
    logResults: { action: "logResults" },
    clearResult: { action: "clearResult" },
    setIsValidResponse: { action: "setIsValidResponse" },
  },
  args: {
    // Min Max Checks
    minChecks: 0,
    maxChecks: 4,

    // Qualitative Options
    option0: "Option 0",
    option1: "Option 1",
    option2: "Option 2",
    option3: "Option 3",
    option4: "Option 4",
    option5: "Option 5",
    option6: "Option 6",
    option7: "Option 7",

    // Styling Options
    alignment: "center",
    textColor: "black",
    colorScheme: "green",
    fontSize: "1em",
    fontFamily: "Arial",
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
