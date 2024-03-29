import Icon from "./Icon";
import ResponseItem from "./ResponseItem";

export default {
  title: "Choose One",
  component: ResponseItem,
  argTypes: {
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },
  args: {
    option0: "Option 1",
    option1: "Option 2",
    option2: "Option 3",
    option3: "Option 4",
    dropDown: false,
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
