import { ToggleButton } from "components/core";

export default {
  title: "Core UI/ToggleButton",
  component: ToggleButton,
  argTypes: {
    onClick: { action: "toggled!" },
    text: { control: "text" },
  },
  //Default Control
  args: {
    text: "Text",
  },
};

export const WithText = (args) => (
  <ToggleButton {...args}>{args.text}</ToggleButton>
);
