import { Frame } from "../core/Frame";
import { ScaleBar, FlexContainer } from "../core/ScaleBar";
import { Question } from "../core/Question";
import { Radio } from "./Radio";

// export interface DiscreteScaleProps {
//   /** Options for the scale's radio inputs */
//   radioOptions?: {
//     /** A valid CSS Color value for all label text */
//     labelColor?: string;
//     /** A valid CSS Font Family value for all label text. */
//     fontFamily?: string;
//     /** A valid CSS Font Size value for the label text. */
//     fontSize?: string;
//     /** Whether labels should be `above` or `below` radio inputs. */
//     labelAlignment: "above" | "below";
//     /** Which one, if any, of the radio inputs specified,
//      * should start selected, by array index. */
//     initialIndex?: number;
//   };

//   /** The actual radio input values, and optional secondary labels. */
//   radios?: string[][];

//   /** A valid CSS Dimension value for the height of the component's frame */
//   frameHeight?: string;

//   /** Options for the scale's question text */
//   questionOptions?: QuestionProps;

//   /** Question text to display */
//   question?: string;

//   /** Options for the scale's horizontal bar */
//   barOptions?: ScaleBarProps;
// }

/** A Discrete Scale */

export const Grid = ({
  radioOptions = {
    labelAlignment: "below",
  },
  radios = [["1", "Secondary Label"]],
  frameHeight,
  questionOptions = {},
  question,
  rows = 1,
  rowLabels = [["Row 1"], ["Row 2"], ["Row 3"], ["Row 4"]],
}) => {
  console.log(rows);
  const generateRadioRows = (numRows) => {
    const allRows = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const radioRow = radios.map((radio, radioIndex) => (
        <Radio
          {...radioOptions}
          labelAbove={radioOptions.labelAlignment !== "above"}
          id={`radioRow${rowIndex + 1}-${radioIndex}`} // Unique ID for each radio
          name={`radioRow${rowIndex + 1}`} // Unique name for all radios in this row
          key={`radioRow${rowIndex + 1}-${radioIndex}`}
          index={radioIndex}
          defaultChecked={radioOptions.initialIndex === radioIndex}
          value={rowIndex === 0 ? radio[0] : null}
          secondaryLabel={radio[1]}
        />
      ));

      allRows.push(
        <div
          key={`row-${rowIndex}`}
          style={{ display: "flex", flexDirection: "row", gap: 100 }}
        >
          {rowLabels[rowIndex] && (
            <div style={{ marginRight: 20, fontWeight: "bold" }}>
              {rowLabels[rowIndex]}
            </div>
          )}
          {radioRow}
        </div>
      );
    }
    return allRows;
  };

  const radioRows = generateRadioRows(rows);

  return (
    <Frame frameHeight={frameHeight}>
      <Question {...questionOptions}>{question}</Question>
      <div
        style={{
          top: "20%",
          position: "relative",
        }}
      >
        <FlexContainer>
          <div
            style={{
              gap: 50,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {radioRows}
          </div>
        </FlexContainer>
      </div>
    </Frame>
  );
};
