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
  title: "Number",
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
    defaultValue: 0,
    min: 0,
    max: 100,
    precision: 0,
  },
};

export const NoDefaultValue = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    min: 0,
    max: 100,
    precision: 0,
  },
};

export const CustomRange = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    defaultValue: 0,
    min: -50,
    max: 50,
    precision: 0,
  },
};

export const WithPrecision = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    defaultValue: 0,
    min: 0,
    max: 100,
    precision: 2,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
