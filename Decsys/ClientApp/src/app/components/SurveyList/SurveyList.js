import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Typography, Input } from "@smooth-ui/core-sc";
import { FlexBox, EmptyState } from "../ui";
import SortPanel, { PureSortPanel } from "./SortPanel";
import { List } from "styled-icons/fa-solid";
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
    onFilterChange: PropTypes.func.isRequired,
    onEmptyActionClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    surveys: {},
    sorted: []
  };

  componentDidMount() {
    // initialise the sorted list on load if necessary
    const { surveys, sorted, sortState, dispatch } = this.props;
    // TODO: action //sortSurveyList(sort.key, sort[sort.key]));
    if (Object.keys(surveys).length && !sorted.length)
      dispatch({ type: "SORT_SURVEYS" });
  }

  render() {
    const {
      surveys,
      onEmptyActionClick,
      filter,
      filtered,
      allowLaunch,
      onFilterChange,
      sortState
    } = this.props;
    return !Object.keys(surveys).length ? (
      <EmptyState
        splash={<List />}
        message="You don't have any surveys yet."
        callToAction={{ label: "Create a survey", onClick: onEmptyActionClick }}
      />
    ) : (
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
  ({ surveyList: { surveys, ordered, filtered, filter, sortState } }) => ({
    surveys,
    ordered,
    filtered,
    filter,
    sortState,
    allowLaunch: false // todo isSurveyActive(surveys)
  }),
  dispatch => ({
    onFilterChange: dispatch({ type: "FILTER_CHANGE" }), // TODO: action
    onEmptyActionClick: dispatch({ type: "CREATE_SURVEY" }) // TODO: action
  })
)(PureSurveyList);

export { PureSurveyList };

export default SurveyList;
