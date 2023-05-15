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
  title: "Multi Visual Analog Scale",
  component: ResponseItem,
};
export const Basic = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    useConfidenceInput: {
      options: ["None", "input", "scale"],
      control: {
        type: "radio",
        labels: { None: "None", input: "Input", scale: "Scale" },
      },
    },
  },
};

export const primary = {
  render: (args) => {
    return <ResponseItem {...args} _context={_context} />;
  },
  args: {
    barLeftMargin: 10,
    barTopMargin: 50,
    barRightMargin: 10,
    barThickness: 8,
    barMaxValue: 100,
    barMinValue: 0,
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
