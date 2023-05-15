import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

const _context = {
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
  title: "Visual Analog Scale",
  component: ResponseItem,
  argTypes: {
    behaviour: {
      options: ["Speirs-Bridge 2010", "Hesketh, Pryor & Hesketh 1988"],
      control: { type: "radio" },
    },

    useConfidenceInput: {
      options: ["None", "input", "scale"],
      control: { type: "radio" },
    },
    labelAlignment: {
      options: ["above", "below"],
      control: { type: "radio" },
    },
    buttons: {
      options: ["None", "Undo", "Reset", "Both"],
      control: { type: "radio" },
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
    barColor: "black",
    barThickness: 8,
    barRightMargin: 10,
    barMaxValue: 100,
    barMinValue: 0,
    labelColor: "black",
    scaleMarkerColor: "black",
  },
};

export const MetadataIcon = () => <Icon width="24px" />;
