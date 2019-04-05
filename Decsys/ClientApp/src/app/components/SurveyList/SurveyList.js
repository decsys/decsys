import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography, Input } from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";
import SortPanel from "./SortPanel";
import SurveyCard from "../SurveyCard";
import {
  getSortedLookup,
  getFilteredLookup
} from "../../state/ducks/surveys/utils";

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
  return allowLaunch;
};

const useSortingAndFiltering = surveys => {
  const [sorting, setSorting] = useState({ key: "name" });
  const [sortedSurveys, setSortedSurveys] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  // update the sorted list appropriately
  useEffect(() => {
    setSortedSurveys(
      getSortedLookup(surveys, sorting.key, sorting[sorting.key])
    );
  }, [surveys, sorting]);

  // update the filtered list appropriately
  useEffect(() => {
    setFilteredSurveys(getFilteredLookup(sortedSurveys, filter));
  }, [filter, sortedSurveys]);

  return {
    sorting,
    setSorting,
    filter,
    setFilter,
    surveyList: filteredSurveys
  };
};

const SurveyList = ({ surveys }) => {
  const allowLaunch = useAllowLaunch(surveys);

  const {
    sorting,
    setSorting,
    filter,
    setFilter,
    surveyList
  } = useSortingAndFiltering(surveys);

  const handleSortButtonClick = key => {
    setSorting({
      ...sorting,
      key,
      [key]: sorting.key === key ? !sorting[key] : sorting[key]
    });
  };

  return (
    <>
      <FlexBox alignItems="center" mb="1em">
        <Typography mr=".5em" display={{ xs: "none", md: "inline" }}>
          Sort by:
        </Typography>
        <SortPanel
          state={sorting}
          onSortButtonClick={handleSortButtonClick}
          keys={["Active", ["Run Count", "runCount"], "Name"]}
        />

        <Input
          placeholder="Filter"
          value={filter}
          size="sm"
          ml="auto"
          onChange={({ target }) => setFilter(target.value)}
        />
      </FlexBox>

      {surveyList.map(
        ({ id }) =>
          !!surveys[id] && (
            <SurveyCard key={id} {...surveys[id]} allowLaunch={allowLaunch} />
          )
      )}
    </>
  );
};

SurveyList.propTypes = {
  surveys: PropTypes.shape({})
};

export default SurveyList;
