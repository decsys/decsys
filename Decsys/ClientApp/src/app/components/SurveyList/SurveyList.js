import React, { Component } from "react";
import { Typography, Input } from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";
import SortPanel from "./SortPanel";

const SurveyList = ({ filter }) => (
  <>
    <FlexBox alignItems="center" mb="1em">
      <Typography mr=".5em" display={{ xs: "none", md: "inline" }}>
        Sort by:
      </Typography>
      <SortPanel keys={["Active", ["Run Count", "runCount"], "Name"]} />

      <Input placeholder="Filter" value={filter} size="sm" ml="auto" />
    </FlexBox>
  </>
);

export default SurveyList;
