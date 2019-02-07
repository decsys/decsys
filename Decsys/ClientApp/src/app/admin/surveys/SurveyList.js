import React, { Component } from "react";
import { connect } from "react-redux";
import Survey from "./Survey";
import SortButtonsPanel from "./SortButtonsPanel";
import { sortSurveyList } from "./_ops";

class SurveyList extends Component {
  componentDidMount() {
    // initialise the sorted list on load if necessary
    const { sorted, sort, dispatch } = this.props;
    if (sorted.length === 0) dispatch(sortSurveyList(sort.key, sort[sort.key]));
  }

  render() {
    const { sorted, sort, surveys } = this.props;
    return (
      <>
        <SortButtonsPanel
          keys={["Active", "Name", ["Run Count", "runCount"]]}
          sort={sort}
        />

        {sorted.map(
          id => !!surveys[id] && <Survey key={id} {...surveys[id]} />
        )}
      </>
    );
  }
}

const SurveyListContainer = connect(state => ({
  ...state.admin.surveys,
  surveys: state.data.surveys
}))(SurveyList);

export default SurveyListContainer;
