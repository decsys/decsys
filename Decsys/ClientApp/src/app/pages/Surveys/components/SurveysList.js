import React from "react";
import SurveyCard from "./SurveyCard";
import { Stack, Box } from "@chakra-ui/core";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";

const SurveysList = ({ surveys }) => {
  const sortingAndFiltering = useSortingAndFiltering(surveys);
  const { surveyList } = sortingAndFiltering;
  return (
    <Stack mt={2}>
      <Box py={4}>
        <SurveysSortingAndFiltering {...sortingAndFiltering} />
      </Box>
      {surveyList.map(
        ({ id }) =>
          !!surveys[id] && <SurveyCard key={id} survey={surveys[id]} />
      )}
    </Stack>
  );
};

export default SurveysList;
