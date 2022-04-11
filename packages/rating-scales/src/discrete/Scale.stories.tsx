import { useEffect } from "react";
import { DiscreteScale, DiscreteScaleProps } from "./DiscreteScale";

const EventHandler = ({ onEvent, children }) => {
  const handleDiscreteSelected = ({ detail }: CustomEvent) => {
    onEvent(detail);
  };

  useEffect(() => {
    document.addEventListener(
      "DiscreteSelected",
      handleDiscreteSelected as EventListener
    );
    return () =>
      document.removeEventListener(
        "DiscreteSelected",
        handleDiscreteSelected as EventListener
      );
  }, []);

  return children;
};

export default {
  title: "Rating Scales/Discrete",
  component: DiscreteScale,
  decorators: [
    (s) => (
      <EventHandler onEvent={() => console.log("Option Selected")}>
        {s()}
      </EventHandler>
    ),
  ],
};

export const Basic = (args: DiscreteScaleProps) => <DiscreteScale {...args} />;

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
