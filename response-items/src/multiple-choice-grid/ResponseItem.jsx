import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import {
  getRadioParams,
  getRadios,
  getRowLabels, // import the helper function
} from "../discrete-scale/utils/radio-params";
import { Grid } from "../../../packages/rating-scales/src/discrete/Grid";

const ResponseItem = ({
  labelColor,
  fontFamily,
  fontSize,
  fontWeight,
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
      }

      return updatedSelectedRows;
    });
  };

  useEffect(() => {
    // Add event listeners for each row name
    rowNames.forEach((name) => {
      document.addEventListener(`${name}Selected`, handleGridSelected);
    });

    // Cleanup event listeners
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
        fontWeight,
      }}
      radios={radios}
      rows={rows}
      rowLabels={rowLabels}
      frameHeight="300px"
      width={width}
      align={align}
      rowTextAlign={rowTextAlign}
      rowNames={rowNames}
    />
  );
};

ResponseItem.params = params;

export default ResponseItem;