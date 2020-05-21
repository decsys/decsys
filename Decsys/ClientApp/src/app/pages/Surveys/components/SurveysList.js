import React from "react";
import SurveyCard from "./SurveyCard";
import { Stack, Box } from "@chakra-ui/core";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";

const SurveysList = ({ surveys }) => {
  const sortingAndFiltering = useSortingAndFiltering(surveys);
  return (
    <Stack mt={2}>
      <Box py={4}>
        <SurveysSortingAndFiltering {...sortingAndFiltering} />
      </Box>

      <Stack boxShadow="0 2px 5px rgba(0,0,0,0.6)">
        {sortingAndFiltering.surveyList.map(
          ({ id }) =>
            !!surveys[id] && (
              <SurveyProvider key={id} value={surveys[id]}>
                <SurveyCard />
              </SurveyProvider>
            )
        )}
      </Stack>
    </Stack>
  );
};

export default SurveysList;
