import React from "react";
import { Typography, Button, Alert } from "@smooth-ui/core-sc";
import { InfoCircle, PlusCircle } from "styled-icons/fa-solid";
import FlexBox from "../../common/FlexBox";
import SurveyList from "./SurveyList";
import Container from "../../common/Container";

// TODO: Create New Survey wiring
const Surveys = () => (
  <Container>
    <FlexBox my="3em" alignItems="center" justifyContent="space-between">
      <Typography variant="h1">My Surveys</Typography>

      <Button variant="secondary">
        <PlusCircle size="1em" /> Create New Survey
      </Button>
    </FlexBox>

    <Alert variant="info">
      <InfoCircle size="1em" /> Please don't forget to backup your surveys and
      results to an external source.
    </Alert>

    <SurveyList />
  </Container>
);

export default Surveys;
