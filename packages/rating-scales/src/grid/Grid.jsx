import { Frame } from "../core/Frame";
import { FlexContainer } from "../core/ScaleBar";
import { Question } from "../core/Question";
import { Radio } from "../discrete/Radio";

export const Grid = ({
  radioOptions = {
    labelColor,
    fontFamily,
    rowFontWeight,
    columnFontWeight,
    fontSize,
  },
  radios = [["1"]],
  frameHeight,
  questionOptions = {},
  question,
  rows = 1,
  rowLabels = [["Row 1"]],
  rowTextAlign,
  rowNames,
}) => {
  const minWidth = `calc(100% / ${radios.length + 1})`;

  const generateRadioRows = (numRows) => {
    const allRows = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const radioRow = radios.map((radio, radioIndex) => (
        <div
          key={`radioCell-${rowIndex}-${radioIndex}`}
          style={{
            minWidth,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Radio
            {...radioOptions}
            labelAbove={true}
            id={`radioRow${rowIndex + 1}-${radioIndex}`}
            name={rowNames[rowIndex]}
            key={`radioRow${rowIndex + 1}-${radioIndex}`}
            index={radioIndex}
            defaultChecked={radioOptions.initialIndex === radioIndex}
            value={radio[0]}
            isGrid={true}
            rowName={rowLabels[rowIndex]}
          />
        </div>
      ));

      allRows.push(
        <div
          key={`row-${rowIndex}`}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: rowIndex % 2 === 0 ? "lightGray" : "white",
          }}
        >
          {/* Row label column */}
          <div
            style={{
              minWidth,
              display: "flex",
              alignItems: "left",
              fontWeight: radioOptions.rowFontWeight,
              fontSize: radioOptions.fontSize,
              color: radioOptions.labelColor,
              paddingInline: 10,
              justifyContent: rowTextAlign,
            }}
          >
            {rowLabels[rowIndex]}
          </div>

          {/* Radio buttons */}
          {radioRow}
        </div>
      );
    }
    return allRows;
  };

  const radioRows = generateRadioRows(rows);
  const columnHeaders = ["", ...radios.map((radio) => radio[0])]; // Added empty header for row labels column

  return (
    <Frame frameHeight={frameHeight}>
      <Question {...questionOptions}>{question}</Question>
      <FlexContainer
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            fontWeight: radioOptions.columnFontWeight,
            textAlign: "center",
            fontSize: radioOptions.fontSize,
            color: radioOptions.labelColor,
          }}
        >
          {columnHeaders.map((header, index) => (
            <div
              key={`header-${index}`}
              style={{
                minWidth,
              }}
            >
              {header}
            </div>
          ))}
        </div>
        {radioRows}
      </FlexContainer>
    </Frame>
  );
};
