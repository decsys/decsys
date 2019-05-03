import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { DotCircle } from "styled-icons/fa-regular/DotCircle";
import paramTypes, { buildPropTypes } from "@decsys/param-types/";
import LikertScale from "@decsys/rating-scales/lib/likert/Scale";
import { version } from "../package.json";

const Likert = ({
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

Likert.params = {
  radio1: paramTypes.string("Option 1", "1"),
  radio1Secondary: paramTypes.string("Secondary Label 1", "Low"),
  radio2: paramTypes.string("Option 2", "2"),
  radio2Secondary: paramTypes.string("Secondary Label 2"),
  radio3: paramTypes.string("Option 3", "3"),
  radio3Secondary: paramTypes.string("Secondary Label 3", "High"),
  radio4: paramTypes.string("Option 4"),
  radio4Secondary: paramTypes.string("Secondary Label 4"),
  radio5: paramTypes.string("Option 5"),
  radio5Secondary: paramTypes.string("Secondary Label 5"),
  radio6: paramTypes.string("Option 6"),
  radio6Secondary: paramTypes.string("Secondary Label 6"),
  radio7: paramTypes.string("Option 7"),
  radio7Secondary: paramTypes.string("Secondary Label 7"),
  barLeftMargin: paramTypes.number("Bar Left Margin (%)", 10),
  barRightMargin: paramTypes.number("Bar Right Margin (%)", 10),
  barTopMargin: paramTypes.number("Bar Top Margin (%)", 50),
  barColor: paramTypes.string("Bar Color", "black"),
  barThickness: paramTypes.number("Bar Width (px)", 8),
  labelColor: paramTypes.string("Label Color", "black"),
  fontFamily: paramTypes.stringUndefined("Font Family"),
  fontSize: paramTypes.string("Font Size", "18pt"),
  labelAlignment: paramTypes.oneOf(
    "Label Alignment",
    ["above", "below"],
    "below"
  )
};

const { propTypes, defaultProps } = buildPropTypes(Likert.params, {
  initialIndex: PropTypes.number,
  initialValue: PropTypes.string
});
Likert.propTypes = propTypes;
Likert.defaultProps = defaultProps;

// Metadata properties
Likert.version = version;
Likert.icon = <DotCircle />;

export default Likert;
