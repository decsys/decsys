import React from "react";
import SurveyCard from "./SurveyCard";
import { Stack, Box } from "@chakra-ui/core";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";

const SurveysList = ({ surveys }) => {
  const sortingAndFiltering = useSortingAndFiltering(surveys);
  const { surveyList } = sortingAndFiltering;
  return (
    <Stack mt={2} shouldWrapChildren>
      <Box py={4}>
        <SurveysSortingAndFiltering {...sortingAndFiltering} />
      </Box>

      {surveyList.map(
        ({ id }) =>
          !!surveys[id] && (
            <SurveyProvider key={id} value={surveys[id]}>
              <SurveyCard />
            </SurveyProvider>
          )
      )}
    </Stack>
  );
};

export default SurveysList;
