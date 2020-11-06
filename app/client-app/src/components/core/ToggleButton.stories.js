import { ToggleButton } from "components/core";

export default {
  title: "Core UI/ToggleButton",
  component: ToggleButton,
  argTypes: {
    onClick: { action: "toggled!" },
  },
};

export const WithText = (args) => <ToggleButton {...args}>Hello</ToggleButton>;
