import React, { Component } from "react";
import { connect } from "react-redux";
import Survey from "./Survey";
import SortButtonsPanel from "./SortButtonsPanel";
import { Row, Typography } from "@smooth-ui/core-sc";
import { sortSurveyList } from "./_ops";
import SurveyListFilterInput from "./SurveyListFilterInput";

class SurveyList extends Component {
  componentDidMount() {
    // initialise the sorted list on load if necessary
    const { sorted, sort, dispatch } = this.props;
    if (sorted.length === 0) dispatch(sortSurveyList(sort.key, sort[sort.key]));
  }

  render() {
    const { filtered, sort, surveys } = this.props;
    return (
      <>
        <Row alignItems="center" mb="1em">
          <Typography mr=".5em">Sort by:</Typography>
          <SortButtonsPanel
            keys={["Active", "Name", ["Run Count", "runCount"]]}
            sort={sort}
          />

          <SurveyListFilterInput size="sm" ml="auto" />
        </Row>

        {filtered.map(
          ({ id }) =>
            !!surveys[id] && (
              <Row key={id}>
                <Survey {...surveys[id]} />
              </Row>
            )
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
