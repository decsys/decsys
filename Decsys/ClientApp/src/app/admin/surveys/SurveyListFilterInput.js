import React from "react";
import { connect } from "react-redux";
import { Input } from "@smooth-ui/core-sc";
import { FilterSurveyList } from "./_actions";

let SurveyListFilterInput = props => {
  const { dispatch, ...rest } = props;
  return (
    <Input
      {...rest}
      placeholder="Filter"
      onChange={e => dispatch(FilterSurveyList(e.target.value))}
      value={props.filter}
    />
  );
};

SurveyListFilterInput = connect(state => ({
  filter: state.admin.surveys.filter
}))(SurveyListFilterInput);

export default SurveyListFilterInput;
