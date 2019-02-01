import React from "react";
import { connect } from "react-redux";
import { getSurveysSortOrder } from "./_selectors";
import Survey from "./Survey";
import SortButtonsPanel from "./SortButtonsPanel";

let SurveyList = ({ surveys, surveysSortOrder }) => (
  <>
    <SortButtonsPanel />

    {surveysSortOrder.map(
      id => !!surveys[id] && <Survey key={id} {...surveys[id]} />
    )}
  </>
);

SurveyList = connect(state => ({
  surveysSortOrder: getSurveysSortOrder(state),
  surveys: state.data.surveys
}))(SurveyList);

export default SurveyList;
