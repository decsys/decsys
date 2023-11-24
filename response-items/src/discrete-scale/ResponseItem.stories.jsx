import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Discrete Scale",
  component: ResponseItem,
  argTypes: {
    barLeftMargin: { control: "number" },
    barRightMargin: { control: "number" },
    barTopMargin: { control: "number" },
    barColor: { control: "color" },
    barThickness: { control: "number" },
    labelColor: { control: "color" },
    fontFamily: { control: "text" },
    fontSize: { control: "number" },
    labelAlignment: {
      control: "select",
      options: ["above", "below"],
    },
    initialIndex: { control: "number" },
    initialValue: { control: "number" },
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },

  args: {
    radio1: "1",
    radio2: "2",
    radio3: "3",
    radio4: "4",
    radio5: "5",
    barLeftMargin: 10,
    barRightMargin: 10,
    barTopMargin: 40,
    barColor: "#ff0000", // Example red color
    barThickness: 5,
    labelColor: "#0000ff", // Example blue color
    fontFamily: "Arial",
    fontSize: 16,
    labelAlignment: "center",
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem radios={args.radios} _context={_context} {...args} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
