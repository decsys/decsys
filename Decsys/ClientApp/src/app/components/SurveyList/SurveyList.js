import React from "react";
import PropTypes from "prop-types";
import { Typography, Input } from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";
import SortPanel from "./SortPanel";
import SurveyCard from "../SurveyCard";
import { useAllowLaunch, useSortingAndFiltering } from "./hooks";

const SurveyList = ({ surveys }) => {
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
            <SurveyCard
              key={id}
              {...surveys[id]}
              allowLaunch={!surveys[id].activeInstanceId}
            />
          )
      )}
    </>
  );
};

SurveyList.propTypes = {
  surveys: PropTypes.shape({})
};

export default SurveyList;
