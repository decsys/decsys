import React from "react";
import { connect } from "react-redux";
import { getSurveysSortOrder } from "./_selectors";
import Survey from "./Survey";

const SurveyList = ({ surveys, surveysSortOrder }) => (
  <>
    {surveysSortOrder.map(
      id => !!surveys[id] && <Survey key={id} {...surveys[id]} />
    )}
  </>
);

const Surveys = connect(state => ({
  surveysSortOrder: getSurveysSortOrder(state),
  surveys: state.data.surveys
}))(SurveyList);

export default Surveys;
