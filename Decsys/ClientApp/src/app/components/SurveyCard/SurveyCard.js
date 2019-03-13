import React from "react";
import FlexBox from "../ui/FlexBox";
import ActiveIndicator from "../ui/ActiveIndicator";
import { Typography } from "@smooth-ui/core-sc";

const SurveyCard = ({ active, name }) => (
  <FlexBox
    backgroundColor="cardBg"
    borderBottom="thin solid"
    borderColor="cardBorder"
  >
    <ActiveIndicator active={active} />

    <Typography variant="h5" title={name} ml={1} p={1} mb={0.5}>
      {name}
    </Typography>
  </FlexBox>
);

export default SurveyCard;
