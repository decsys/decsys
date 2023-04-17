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
    setIsValidResponse: { action: "Next button toggled" },
    logResults: { action: "Results logged" },
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
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
