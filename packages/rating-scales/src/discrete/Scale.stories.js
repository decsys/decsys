import { useEffect } from "react";
import { text, object, optionsKnob, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { DiscreteScale } from "./DiscreteScale";

const EventHandler = ({ onEvent, children }) => {
  const handleDiscreteSelected = ({ detail }) => {
    onEvent(detail);
  };

  useEffect(() => {
    document.addEventListener("DiscreteSelected", handleDiscreteSelected);
    return () =>
      document.removeEventListener("DiscreteSelected", handleDiscreteSelected);
  }, []);

  return children;
};

export default {
  title: "Rating Scales/Discrete",
  component: DiscreteScale,
  decorators: [
    (s) => (
      <EventHandler onEvent={action("Option Selected")}>{s()}</EventHandler>
    ),
  ],
};

export const Basic = () => <DiscreteScale />;

export const OldSample = () => (
  <DiscreteScale
    radios={[["1", "Low"], ["2"], ["3"], ["4"], ["5", "High"]]}
    radioOptions={{
      labelAlignment: "above",
      initialIndex: 0,
      labelColor: "green",
      fontFamily: "Comic Sans MS",
    }}
    question="How much do you like this question?"
    questionOptions={{
      xAlign: "center",
      textColor: "orange",
    }}
  />
);

export const WithKnobs = () => (
  <DiscreteScale
    radios={object("Radio Values and Labels", [
      ["1", "Low"],
      ["2"],
      ["3", "High"],
    ])}
    radioOptions={{
      labelAlignment: optionsKnob(
        "Label Alignment",
        ["above", "below"],
        "below",
        { display: "inline-radio" }
      ),
      initialIndex: number("Initial Selected Index", 0),
      labelColor: text("Label Color", "green"),
      fontFamily: text("Font Family", "Comic Sans MS"),
    }}
    question={text("Question", "How much do you like this question?")}
    questionOptions={{
      xAlign: optionsKnob(
        "Question alignment",
        ["left", "center", "right"],
        "center",
        { display: "inline-radio" }
      ),
      textColor: text("Question Color", "orange"),
    }}
  />
);
