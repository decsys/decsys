import React, { useEffect } from "react";
import * as props from "./Component.props";
import DiscreteScale from "@decsys/rating-scales/esm/discrete";
import stats from "./Component.stats";

const Component = ({
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
  logResults,
  setNextEnabled,
  ...p
}) => {
  // get radio params from all other props
  // (or more accurately, strip out anything the Platform passes
  // that we don't need, like `logEvent` or other API methods)
  const radioParams = Object.keys(p).reduce((acc, key) => {
    if (key.includes("radio")) acc[key] = p[key];
    return acc;
  }, {});

  const handleDiscreteSelected = e => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    document.addEventListener("DiscreteSelected", handleDiscreteSelected);
    return () =>
      document.removeEventListener("DiscreteSelected", handleDiscreteSelected);
  }, []);

  // prepare radio button values
  const radios = Object.keys(radioParams)
    .sort((a, b) => a.match(/\d+/) - b.match(/\d+/)) // guarantee ascending numeric order
    .reduce((acc, key) => {
      if (key.includes("Secondary")) return acc; // ignore secondary params

      const secondaryKey = `${key}Secondary`;

      if (!radioParams[key] && !radioParams[secondaryKey]) return acc;

      const radio = [radioParams[key], radioParams[secondaryKey]];

      acc.push(radio);
      return acc;
    }, []);

  return (
    <DiscreteScale
      barOptions={{
        leftMargin: `${barLeftMargin}%`,
        rightMargin: `${barRightMargin}%`,
        topMargin: `${barTopMargin}%`,
        barColor,
        thickness: `${barThickness}px`
      }}
      radioOptions={{
        labelColor,
        fontFamily,
        fontSize,
        labelAlignment,
        initialIndex,
        initialValue
      }}
      radios={radios}
      frameHeight="300px"
    />
  );
};

Component.params = props.params;
Component.propTypes = props.propTypes;
Component.defaultProps = props.defaultProps;
Component.stats = stats;

export default Component;
