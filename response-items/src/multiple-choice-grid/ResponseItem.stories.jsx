import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Multiple Choice Grid",
  component: ResponseItem,
  argTypes: {
    labelColor: { control: "color" },
    fontFamily: { control: "text" },
    fontSize: { control: "number" },
    fontWeight: {
      control: "select",
      options: ["normal", "bold", "bolder", "lighter"],
    },
    rowTextAlign: {
      control: "select",
      options: ["left", "center", "right"],
    },
    width: { control: "number" },
    initialIndex: { control: "number" },
    initialValue: { control: "number" },
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },

  args: {
    radio1: "Strongly Agree",
    radio2: "Agree",
    radio3: "Neutral",
    radio4: "Disagree",
    radio5: "Strongly Disagree",
    labelColor: "#0000ff", // Example blue color
    fontFamily: "Arial",
    fontSize: 16,
    rows: 4,
    row1Label: "Satisfaction with Service",
    row2Label: "Satisfaction with Product",
    row3Label: "Ease of Use",
    row4Label: "Likelihood to Recommend",
    width: 200,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem radios={args.radios} _context={_context} {...args} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
