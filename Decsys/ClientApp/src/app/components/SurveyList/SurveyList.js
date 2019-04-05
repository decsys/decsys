import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography, Input } from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";
import SortPanel from "./SortPanel";
import SurveyCard from "../SurveyCard";
// import { sortSurveyList, filterSurveyList } from "../../state/ducks/surveys";

const useAllowLaunch = surveys => {
  const [allowLaunch, setAllowLaunch] = useState(false);
  useEffect(
    () =>
      setAllowLaunch(
        Object.keys(surveys).filter(id => surveys[id].activeInstanceId != null)
          .length === 0
      ),
    [surveys]
  );
};

const SurveyList = ({
  surveys,
  sorted,
  filtered,
  filter,
  onFilterChange,
  onSortSurveyList
}) => {
  const allowLaunch = useAllowLaunch(surveys);

  // TODO: lift up state?
  useEffect(() => {
    if (!sorted.length) onSortSurveyList(sortState); // initial sort only if it hasn't been done
  });
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
          onChange={({ target }) => onFilterChange(target.value)}
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
};

SurveyList.propTypes = {
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
  sortState: SortPanel.propTypes.sortState,
  filter: PropTypes.string,
  allowLaunch: PropTypes.bool,
  onFilterChange: PropTypes.func.isRequired,
  onSortSurveyList: PropTypes.func.isRequired
};

SurveyList.defaultProps = {
  sorted: [],
  filtered: []
};

// const SurveyList = connect(
//   ({ surveys: { sorted, filtered, filter, sortState } }) => ({
//     sorted,
//     filtered,
//     filter,
//     sortState
//   }),
//   dispatch => ({
//     onSortSurveyList: sortState =>
//       dispatch(sortSurveyList(sortState.key, sortState[sortState.key])),
//     onFilterChange: filter => dispatch(filterSurveyList(filter))
//   })
// )(PureSurveyList);

// export { PureSurveyList };

export default SurveyList;
