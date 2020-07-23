import React from "react";
import { Grid } from "@chakra-ui/core";

const SurveyLayout = ({ children }) => {
  return (
    <Grid templateRows="54px minmax(20px, 1fr) 80px" height="100vh">
      {children}
    </Grid>
  );
};

export default SurveyLayout;
