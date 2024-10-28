import { useEffect } from "react";
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
  rows,
  width,
  _context: { logResults, setNextEnabled },
  ...p
}) => {
  const radioParams = getRadioParams(p);

  const handleDiscreteSelected = (e) => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("DiscreteSelected", handleDiscreteSelected);
    return () =>
      document.removeEventListener("DiscreteSelected", handleDiscreteSelected);
  }, []);

  // prepare radio button values
  const radios = getRadios(radioParams);

  // prepare row labels
  const rowLabels = getRowLabels(p);

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
    />
  );
};

ResponseItem.params = params;

export default ResponseItem;
