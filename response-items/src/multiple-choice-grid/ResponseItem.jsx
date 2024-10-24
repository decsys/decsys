import { useEffect } from "react";
import { params } from "./ResponseItem.params";
import { DiscreteScale } from "@decsys/rating-scales/discrete";
import { getRadioParams, getRadios } from "../discrete-scale/utils/radio-params";

const ResponseItem = ({
  barLeftMargin,
  barRightMargin,
  barTopMargin,
  barColor,
  barThickness,
  labelColor,
  fontFamily,
  fontSize,
  labelAlignment,
  initialIndex,
  initialValue,
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

  return (
    <DiscreteScale
      barOptions={{
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`,
      }}
      radioOptions={{
        labelColor,
        fontFamily,
        fontSize,
        labelAlignment,
        initialIndex,
        initialValue,
      }}
      radios={radios}
      frameHeight="300px"
    />
  );
};

ResponseItem.params = params;

export default ResponseItem;
