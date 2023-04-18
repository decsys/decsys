import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setIsValidResponse: () => {},
  logResults: () => {},
};

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
    logResults: { action: "Results logged" },
    setIsValidResponse: { action: "Next button toggled" },
    handleChange: { action: "clicked" },
  },
};

export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    option0: ("Option 0", "Option 0"),
    option1: ("Option 1", "Option 1"),
    option2: ("Option 2", "Option 2"),
    option3: ("Option 3", "Option 3"),
    option4: ("Option 4", ""),
    option5: ("Option 5", ""),
    option6: ("Option 6", ""),
    option7: ("Option 7", ""),
    option8: ("Option 8", ""),
    option9: ("Option 9", ""),
    confirmed: false,
  },
};

export const OptionValueNotPropOrderBased = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    option8: "",
    option7: "",
    option6: "",
    option0: "All of the time",
    option1: "Most of the time",
    option2: "A good bit of the time",
    option9: "None of the time",
    option3: "Some of the time",
    option4: "A little bit of the time",
    option5: "",
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
