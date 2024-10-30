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
  rowNames,
}) => {
  const generateRadioRows = (numRows) => {
    const allRows = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const radioRow = radios.map((radio, radioIndex) => {
        return (
          <Radio
            {...radioOptions}
            labelAbove={true}
            id={`radioRow${rowIndex + 1}-${radioIndex}`}
            name={rowNames[rowIndex]} // Assign the correct name for the row
            key={`radioRow${rowIndex + 1}-${radioIndex}`}
            index={radioIndex}
            defaultChecked={radioOptions.initialIndex === radioIndex}
            value={radio[0]}
            isGrid={true}
            rowName={rowLabels[rowIndex]}
          />
        );
      });

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
            backgroundColor: rowIndex % 2 === 0 ? "lightGray" : "white",
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
  let columnHeaders = [];

  radios.forEach((radio) => {
    columnHeaders.push(radio[0]);
  });

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: align,
            alignItems: "center",
            gap: 70,
            padding: "10px",
            paddingRight: "5%",
            fontWeight: radioOptions.fontWeight,
            textAlign: "center",
            fontSize: radioOptions.fontSize,
            color: radioOptions.labelColor,
          }}
        >
          {/* Empty space for row labels alignment */}
          <div style={{ width: width }}></div>
          {columnHeaders.map((header, index) => (
            <div key={`header-${index}`} style={{ textAlign: "center" }}>
              {header}
            </div>
          ))}
        </div>
        {radioRows}
      </FlexContainer>
    </Frame>
  );
};
