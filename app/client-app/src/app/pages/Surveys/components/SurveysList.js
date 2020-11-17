import React from "react";
import SurveyCard from "./SurveyCard";
import { Stack, Box } from "@chakra-ui/react";
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

      <Stack boxShadow="callout" spacing={0}>
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
