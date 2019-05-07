import React, { useEffect } from "react";
import * as props from "./Component.props";
import { LikertScale } from "@decsys/rating-scales";

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
  const handleLikertSelected = e => {
    logResults(e.detail);
    setNextEnabled(true);
  };

  useEffect(() => {
    setNextEnabled(false);
    document.addEventListener("LikertSelected", handleLikertSelected);
    return () =>
      document.removeEventListener("LikertSelected", handleLikertSelected);
  }, []);

  // prepare radio button values
  const radios = [];
  for (let i = 0; i < 7; i++) {
    const key = `radio${i}`;
    if (radioParams[key]) {
      const r = [radioParams[key]];

      if (radioParams[`${key}Secondary`])
        r.push(radioParams[`${key}Secondary`]);

      radios.push(r);
    }
  }

  return (
    <LikertScale
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

export default Component;
