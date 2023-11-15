import { Question } from "./Question";

export default {
  title: "core/Question",
  component: Question,
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
