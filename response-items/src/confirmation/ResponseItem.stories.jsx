import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Confirmation",
  component: ResponseItem,
  argTypes: {
    label: { control: "text" },
    defaultValue: { control: "text" },
    confirmed: { control: "booleon" },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },
  args: {
    label: "Confirm to continue",
    defaultValue: "Default Value",
    confirmed: false,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} _context={_context} />;
};

export const InitiallyChecked = (args) => {
  const _context = { ...args };
  return <ResponseItem {...args} confirmed={true} _context={_context} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
