import { FiCoffee } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import EmptyState from "./EmptyState";

export default {
  title: "Core UI/EmptyState",
  component: EmptyState,
  argTypes: {
    message: { control: "text" },
    onClick: { action: "Pizza Ordered" },
  },
};

export const Basic = (args) => <EmptyState message={args.message} />;

export const AlternateIcon = () => (
  <EmptyState splash={FiCoffee} message="Take a break, you've earned it." />
);

export const CallToAction = (args) => (
  <EmptyState
    callToAction={{
      label: "Order for me",
      onClick: args.onClick,
    }}
    splash={FaPizzaSlice}
    message="Everything's done. Guess it's Pizza time."
  />
);
