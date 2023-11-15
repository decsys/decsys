import { FlexContainer, ScaleBar } from "./ScaleBar";

export default {
  title: "core/ScaleBar",
  component: ScaleBar,
  tags: ["autodocs"],
  argTypes: {
    leftMargin: { control: "text" },
    rightMargin: { control: "text" },
    topMargin: { control: "text" },
    thickness: { control: "text" },
    barColor: { control: "color" },
  },
};

export const Default = {
  args: {
    leftMargin: "10%",
    rightMargin: "10%",
    topMargin: "50%",
    thickness: "0.2em",
    barColor: "black",
  },
};
