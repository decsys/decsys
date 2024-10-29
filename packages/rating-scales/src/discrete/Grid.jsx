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
  align = "center",
  rowTextAlign,
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
          isGrid={true}
        />
      ));

      allRows.push(
        <div
          key={`row-${rowIndex}`}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: align,
            alignItems: "right",
            gap: 120,
            padding: "10px",
            backgroundColor: rowIndex % 2 === 0 ? "gray" : "white",
            paddingRight: "5%",
          }}
        >
          <div
            style={{
              width: width,
              fontWeight: radioOptions.fontWeight,
              textAlign: rowTextAlign,
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
      <FlexContainer
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {radioRows}
      </FlexContainer>
    </Frame>
  );
};
