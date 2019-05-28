import React, { useEffect } from "react";
import * as props from "./Component.props";
import DiscreteScale from "@decsys/rating-scales/discrete/Scale.js";
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
  ...radioParams
}) => {
  const handleDiscreteSelected = e => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    setNextEnabled(false);
    document.addEventListener("DiscreteSelected", handleDiscreteSelected);
    return () =>
      document.removeEventListener("DiscreteSelected", handleDiscreteSelected);
  }, []);

  // prepare radio button values
  const radios = [];
  for (let i = 0; i < 7; i++) {
    const key = `radio${i + 1}`;
    if (radioParams[key]) {
      const r = [radioParams[key]];

      if (radioParams[`${key}Secondary`])
        r.push(radioParams[`${key}Secondary`]);

      radios.push(r);
    }
  }

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
