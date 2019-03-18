import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import EmptyState from "./EmptyState";
import { Coffee } from "styled-icons/feather";
import { PizzaSlice } from "styled-icons/fa-solid";

storiesOf("Common UI/EmptyState", module)
  .addDecorator(StoryRouter())
  .add("Default", () => <EmptyState message={text("Message", undefined)} />)
  .add("Alternate Icon", () => (
    <EmptyState splash={<Coffee />} message="Take a break, you've earned it." />
  ))
  .add("Call to Action", () => (
    <EmptyState
      callToAction={{
        label: "Order for me",
        onClick: action("Pizza ordered")
      }}
      splash={<PizzaSlice />}
      message="Everything's done. Guess it's Pizza time."
    />
  ));
