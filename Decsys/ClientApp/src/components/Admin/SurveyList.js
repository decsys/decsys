import React from "react";
import { Grid, Button, Typography, Row, Box } from "@smooth-ui/core-sc";
import { PlusCircle } from "styled-icons/fa-solid";

const SurveyList = props => (
  <>
    <Grid>
      <Row my="2em">
        <Typography variant="h1">My Surveys</Typography>
        <Box ml="auto" display="flex" alignItems="center">
          <Button variant="secondary">
            <PlusCircle size="1em" /> Create New Survey
          </Button>
        </Box>
      </Row>
      <Row />
    </Grid>
  </>
);

export default SurveyList;
