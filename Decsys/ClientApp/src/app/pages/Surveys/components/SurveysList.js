import React from "react";
import SurveyCard from "./SurveyCard";
import { Stack } from "@chakra-ui/core";

const SurveysList = ({ surveys }) => (
  <Stack>
    {surveys.map(s => (
      <SurveyCard key={s.id} survey={s} />
    ))}
  </Stack>
);

export default SurveysList;
