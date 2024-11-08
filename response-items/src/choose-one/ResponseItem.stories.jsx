import Icon from "./Icon";
import ResponseItem from "./ResponseItem";

export default {
  title: "Choose One",
  component: ResponseItem,
  argTypes: {
    // Dropdown Flag
    dropDown: { control: "boolean" },

    // Styling Options
    width: { control: "text" },
    alignment: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
    },
    textColor: { control: { type: "color" } },
    fontSize: { control: "text" },
    fontFamily: { control: "text" },

    // Qualitative Options
    option0: { control: "text" },
    option1: { control: "text" },
    option2: { control: "text" },
    option3: { control: "text" },
    // Actions
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },
  args: {
    // Dropdown Flag
    dropDown: false,

    // Styling Options
    width: "70%",
    alignment: "center",
    textColor: "black",
    fontSize: "1em",
    fontFamily: "Arial",

    // Qualitative Options
    option0: "Option 1",
    option1: "Option 2",
    option2: "Option 3",
    option3: "Option 4",
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const DropDown = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} dropDown={true} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
