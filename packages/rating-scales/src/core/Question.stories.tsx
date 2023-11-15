import { Question } from "./Question";

export default {
  title: "Example/Question",
  component: Question,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    textColor: { control: "color" },
    fontFamily: { control: "text" },
    fontSize: { control: "text" },
    xAlign: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
};

export const Default = {
  args: {
    textColor: "black",
    topMargin: "10%",
    xMargin: "5%",
    fontFamily: "Arial",
    fontSize: "1.6em",
    xAlign: "left",
    children: "Your question here",
  },
};

export const CenterAligned = {
  args: {
    ...Default.args,
    xAlign: "center",
  },
};

export const RightAligned = {
  args: {
    ...Default.args,
    xAlign: "right",
  },
};

export const CustomStyle = {
  args: {
    textColor: "blue",
    topMargin: "20%",
    xMargin: "10%",
    fontFamily: "Times New Roman",
    fontSize: "2em",
    xAlign: "center",
    children: "Your custom styled question",
  },
};
