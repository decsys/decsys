import React from "react";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { FiCoffee } from "react-icons/fi";
import { FaPizzaSlice } from "react-icons/fa";
import EmptyState from "./EmptyState";

export default {
  title: "Core UI/EmptyState",
  component: EmptyState
};

export const Basic = () => <EmptyState message={text("Message", undefined)} />;

export const AlternateIcon = () => (
  <EmptyState splash={FiCoffee} message="Take a break, you've earned it." />
);

export const CallToAction = () => (
  <EmptyState
    callToAction={{
      label: "Order for me",
      onClick: action("Pizza ordered")
    }}
    splash={FaPizzaSlice}
    message="Everything's done. Guess it's Pizza time."
  />
);
