import React from "react";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { Coffee } from "styled-icons/feather/Coffee";
import { PizzaSlice } from "styled-icons/fa-solid/PizzaSlice";
import { EmptyState } from "components/core";

export default {
  title: "Core UI/EmptyState",
  component: EmptyState
};

export const Basic = () => <EmptyState message={text("Message", undefined)} />;

export const AlternateIcon = () => (
  <EmptyState splash={<Coffee />} message="Take a break, you've earned it." />
);

export const CallToAction = () => (
  <EmptyState
    callToAction={{
      label: "Order for me",
      onClick: action("Pizza ordered")
    }}
    splash={<PizzaSlice />}
    message="Everything's done. Guess it's Pizza time."
  />
);
