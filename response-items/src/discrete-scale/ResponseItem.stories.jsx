import ResponseItem from "./ResponseItem";
import Icon from "./Icon";

export default {
  title: "Discrete Scale",
  component: ResponseItem,
  argTypes: {
    // Radio Options
    radio1: { control: "text" },
    radio1Secondary: { control: "text" },
    radio2: { control: "text" },
    radio2Secondary: { control: "text" },
    radio3: { control: "text" },
    radio3Secondary: { control: "text" },
    radio4: { control: "text" },
    radio4Secondary: { control: "text" },
    radio5: { control: "text" },
    radio5Secondary: { control: "text" },
    // Bar and Label Controls
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

    // Actions
    initialIndex: { control: "number" },
    initialValue: { control: "number" },
    setIsValidResponse: { action: "setIsValidResponse" },
    logResults: { action: "logResults" },
    setNextEnabled: { action: "setNextEnabled" },
  },

  args: {
    // Radio Labels and Secondary Labels
    radio1: "1",
    radio1Secondary: "Min",
    radio2: "2",
    radio2Secondary: "Low",
    radio3: "3",
    radio3Secondary: "Medium",
    radio4: "4",
    radio4Secondary: "High",
    radio5: "5",
    radio5Secondary: "Max",

    // Bar and Label Properties
    barLeftMargin: 10,
    barRightMargin: 10,
    barTopMargin: 40,
    barColor: "#ff0000", // Red
    barThickness: 5,
    labelColor: "#0000ff", // Blue
    fontFamily: "Arial",
    fontSize: 16,
    labelAlignment: "below",

    // Initial values
    initialIndex: 0,
    initialValue: 1,
  },
};

export const Basic = (args) => {
  const _context = { ...args };
  return <ResponseItem radios={args.radios} _context={_context} {...args} />;
};

export const MetadataIcon = () => <Icon width="24px" />;
