import { Frame } from "../core/Frame";
import { FlexContainer } from "../core/ScaleBar";
import { Question } from "../core/Question";
import { Radio } from "./Radio";

export const Grid = ({
  radioOptions = {
    labelColor,
    fontFamily,
    fontWeight,
    fontSize,
  },
  radios = [["1"]],
  frameHeight,
  questionOptions = {},
  question,
  rows = 1,
  rowLabels = [["Row 1"]],
  width,
  align,
}) => {
  const generateRadioRows = (numRows) => {
    const allRows = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const radioRow = radios.map((radio, radioIndex) => (
        <Radio
          {...radioOptions}
          labelAbove={true}
          id={`radioRow${rowIndex + 1}-${radioIndex}`}
          name={`radioRow${rowIndex + 1}`}
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
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 120,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              width: width,
              fontWeight: radioOptions.fontWeight,
              textAlign: "left",
              fontSize: radioOptions.fontSize,
              color: radioOptions.labelColor,
            }}
          >
            {rowLabels[rowIndex]}
          </div>
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
        <FlexContainer
          style={{
            display: "flex",
            justifyContent: align,
            backgroundColor: "gray",
          }}
        >
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
