// TODO: fix CTA onClick action
import { FiCoffee } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import EmptyState from "./EmptyState";

export default {
  title: "Core UI/EmptyState",
  component: EmptyState,
  argTypes: {
    callToAction: { onClick: { action: "Call To Action clicked" } },
  },
};
const Template = (args) => <EmptyState {...args} />;

export const Basic = Template.bind({});

export const AlternateIcon = Template.bind({});
AlternateIcon.args = {
  splash: FiCoffee,
  message: "Take a break, you've earned it.",
};

export const CallToAction = Template.bind({});
CallToAction.args = {
  callToAction: {
    label: "Order for me",
  },
  splash: FaPizzaSlice,
  message: "Everything's done. Guess it's Pizza time.",
};
