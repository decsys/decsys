import { Frame } from "../core/Frame";
import { ScaleBar, FlexContainer, ScaleBarProps } from "../core/ScaleBar";
import { Question, QuestionProps } from "../core/Question";
import { Radio } from "./Radio";

export interface DiscreteScaleProps {
  /** Options for the scale's radio inputs */
  radioOptions?: {
    /** A valid CSS Color value for all label text */
    labelColor?: string;
    /** A valid CSS Font Family value for all label text. */
    fontFamily?: string;
    /** A valid CSS Font Size value for the label text. */
    fontSize?: string;
    /** Whether labels should be `above` or `below` radio inputs. */
    labelAlignment: "above" | "below";
    /** Which one, if any, of the radio inputs specified,
     * should start selected, by array index. */
    initialIndex?: number;
  };

  /** The actual radio input values, and optional secondary labels. */
  radios?: string[][];

  /** A valid CSS Dimension value for the height of the component's frame */
  frameHeight?: string;

  /** Options for the scale's question text */
  questionOptions?: QuestionProps;

  /** Question text to display */
  question?: string;

  /** Options for the scale's horizontal bar */
  barOptions?: ScaleBarProps;
}

/** A Discrete Scale */
export const DiscreteScale = ({
  radioOptions = {
    labelAlignment: "below",
  },
  radios = [["1"]],
  frameHeight,
  questionOptions = {},
  question,
  barOptions = {},
}: DiscreteScaleProps) => {
  const radioComponents = [];
  for (let i = 0; i < radios.length; i++) {
    const id = `radio${i + 1}`;
    radioComponents.push(
      <Radio
        {...radioOptions}
        labelAbove={radioOptions.labelAlignment === "above"}
        id={id}
        key={id}
        index={i}
        defaultChecked={radioOptions.initialIndex === i}
        value={radios[i][0]}
        secondaryLabel={radios[i][1]}
      />
    );
  }

  return (
    <Frame frameHeight={frameHeight}>
      <Question {...questionOptions}>{question}</Question>
      <ScaleBar {...barOptions}>
        <FlexContainer>{radioComponents}</FlexContainer>
      </ScaleBar>
    </Frame>
  );
};
