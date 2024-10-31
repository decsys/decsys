import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import {
  getRadioParams,
  getRadios,
} from "../discrete-scale/utils/radio-params";
import { Grid } from "../../../packages/rating-scales/src/grid/Grid";
import { getRowLabels } from "./utils/row-label";

const ResponseItem = ({
  labelColor,
  fontFamily,
  fontSize,
  rowFontWeight,
  columnFontWeight,
  labelAlignment,
  initialIndex,
  initialValue,
  width,
  alignment,
  rowTextAlign,
  _context: { logResults, setNextEnabled },
  ...p
}) => {
  const radioParams = getRadioParams(p);

  // prepare radio button values
  const radios = getRadios(radioParams);

  // prepare row labels
  const rowLabels = getRowLabels(p);
  const rows = rowLabels.filter((label) => label !== "").length;
  const rowNames = Array.from({ length: rows }, (_, i) => `radioRow${i + 1}`);

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  const [selectedRows, setSelectedRows] = useState(
    rowLabels
      .filter((name) => name != "")
      .reduce((acc, name) => ({ ...acc, [name]: false }), {})
  );
  const [selectedDetails, setSelectedDetails] = useState({});

  const handleGridSelected = (e) => {
    const { detail } = e;
    const rowLabel = Object.keys(detail)[0];

    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = { ...prevSelectedRows, [rowLabel]: true };

      // Check if all rows have been selected
      const allSelected = Object.values(updatedSelectedRows).every(
        (val) => val
      );

      const newSelectedDetails = { ...selectedDetails, ...detail };

      setSelectedDetails(newSelectedDetails);

      if (allSelected) {
        logResults(newSelectedDetails);
        setNextEnabled(true);
        console.log(newSelectedDetails);
      }

      return updatedSelectedRows;
    });
  };

  useEffect(() => {
    rowNames.forEach((name) => {
      document.addEventListener(`${name}Selected`, handleGridSelected);
    });

    return () => {
      rowNames.forEach((name) => {
        document.removeEventListener(`${name}Selected`, handleGridSelected);
      });
    };
  }, [rowNames]);

  return (
    <Grid
      radioOptions={{
        labelColor,
        fontFamily,
        fontSize,
        labelAlignment,
        initialIndex,
        initialValue,
        columnFontWeight,
        rowFontWeight,
      }}
      radios={radios}
      rows={rows}
      rowLabels={rowLabels}
      align={align}
      rowTextAlign={rowTextAlign}
      rowNames={rowNames}
    />
  );
};

ResponseItem.params = params;

export default ResponseItem;
