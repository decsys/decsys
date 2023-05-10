import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
  surveyId: 0,
  pageId: "",
  itemId: "",
  setIsValidResponse: (isValid) => {
    console.log("set valid response", isValid);
  },
  logResults: (results) => {
    console.log("log result", results);
  },
  clearResult: (results) => {
    console.log("results cleared", results);
  },
};

export default {
  title: "Confirmation",
  component: ResponseItem,
};

export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    label: "Confirm to continue",
    defaultValue: "something",
  },
};

export const InitiallyChecked = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    label: "Confirm to continue",
    defaultValue: "Default Value",
    confirmed: true,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
