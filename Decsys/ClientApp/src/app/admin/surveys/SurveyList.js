import React, { Component } from "react";
import { connect } from "react-redux";
import Survey from "./Survey";
import SortButtonsPanel from "./SortButtonsPanel";
import { Typography } from "@smooth-ui/core-sc";
import { sortSurveyList } from "./_ops";
import SurveyListFilterInput from "./SurveyListFilterInput";
import FlexBox from "../../common/FlexBox";
import { isAnySurveyActive } from "./_selectors";

class SurveyList extends Component {
  componentDidMount() {
    // initialise the sorted list on load if necessary
    const { sorted, sort, dispatch } = this.props;
    if (sorted.length === 0) dispatch(sortSurveyList(sort.key, sort[sort.key]));
  }

  render() {
    const { filtered, sort, surveys, allowLaunch } = this.props;
    return (
      <>
        <FlexBox alignItems="center" mb="1em">
          <Typography mr=".5em" display={{ xs: "none", md: "inline" }}>
            Sort by:
          </Typography>
          <SortButtonsPanel
            keys={["Active", ["Run Count", "runCount"], "Name"]}
            sort={sort}
          />

          <SurveyListFilterInput size="sm" ml="auto" />
        </FlexBox>

        {filtered.map(
          ({ id }) =>
            !!surveys[id] && (
              <Survey key={id} {...surveys[id]} allowLaunch={allowLaunch} />
            )
        )}
      </>
    );
  }
}

const SurveyListContainer = connect(state => ({
  ...state.admin.surveys,
  surveys: state.data.surveys,
  allowLaunch: !isAnySurveyActive(state.data.surveys)
}))(SurveyList);

export default SurveyListContainer;
