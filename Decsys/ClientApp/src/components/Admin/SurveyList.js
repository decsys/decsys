import React from "react";
import { Grid, Button, Typography, Row, Box, Alert } from "@smooth-ui/core-sc";
import { PlusCircle, InfoCircle } from "styled-icons/fa-solid";

import SurveyCardList from "./SurveyCardList";

const SurveyList = props => (
  <>
    <Grid>
      <Row my="3em">
        <Typography variant="h1">My Surveys</Typography>
        <Box ml="auto" display="flex" alignItems="center">
          <Button variant="secondary">
            <PlusCircle size="1em" /> Create New Survey
          </Button>
        </Box>
      </Row>
      <Row>
        <Alert width="100%" variant="info">
          <InfoCircle size="1em" /> Please don't forget to backup your surveys
          and results to an external source.
        </Alert>
      </Row>
      <SurveyCardList />
    </Grid>
  </>
);

export default SurveyList;
