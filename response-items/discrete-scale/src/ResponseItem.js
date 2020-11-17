import { useEffect } from "react";
import * as props from "./ResponseItem.props";
import DiscreteScale from "@decsys/rating-scales/cjs/discrete";
import { stats } from "./ResponseItem.stats";
import { getRadios, getRadioParams } from "./utils/radio-params";

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

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;
ResponseItem.stats = stats;

export default ResponseItem;
