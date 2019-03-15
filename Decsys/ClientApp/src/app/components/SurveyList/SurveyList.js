import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Input } from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";
import SortPanel, { PureSortPanel } from "./SortPanel";
import SurveyCard from "../SurveyCard";

class PureSurveyList extends Component {
  static propTypes = {
    surveys: PropTypes.shape({}),
    sorted: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    filtered: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    sortState: PureSortPanel.propTypes.sortState,
    filter: PropTypes.string,
    allowLaunch: PropTypes.bool,
    onFilterChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    sorted: []
  };

  componentDidMount() {
    // initialise the sorted list on load if necessary
    const { sorted, sortState, dispatch } = this.props;
    // TODO: action //sortSurveyList(sort.key, sort[sort.key]));
    if (!sorted.length) dispatch({ type: "SORT_SURVEYS" });
  }

  render() {
    const {
      surveys,
      filter,
      filtered,
      allowLaunch,
      onFilterChange,
      sortState
    } = this.props;
    return (
      <>
        <FlexBox alignItems="center" mb="1em">
          <Typography mr=".5em" display={{ xs: "none", md: "inline" }}>
            Sort by:
          </Typography>
          <SortPanel
            sortState={sortState}
            keys={["Active", ["Run Count", "runCount"], "Name"]}
          />

          <Input
            placeholder="Filter"
            value={filter}
            size="sm"
            ml="auto"
            onChange={onFilterChange}
          />
        </FlexBox>

        {filtered.map(
          ({ id }) =>
            !!surveys[id] && (
              <SurveyCard key={id} {...surveys[id]} allowLaunch={allowLaunch} />
            )
        )}
      </>
    );
  }
}

const SurveyList = connect(
  ({ surveyList: { sorted, filtered, filter, sortState } }) => ({
    sorted,
    filtered,
    filter,
    sortState
  }),
  dispatch => ({
    onFilterChange: () => dispatch({ type: "FILTER_CHANGE" }) // TODO: action
  })
)(PureSurveyList);

export { PureSurveyList };

export default SurveyList;
