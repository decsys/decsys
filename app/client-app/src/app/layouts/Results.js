import React from "react";
import { Grid } from "@chakra-ui/core";
import DefaultAppBar from "./components/DefaultAppBar";

const Results = ({ children }) => (
  <Grid
    rowGap={2}
    templateRows="54px minmax(20px,auto) minmax(20px,auto) minmax(20px, 1fr) 60px"
    height="100vh"
  >
    <DefaultAppBar />
    {children}
  </Grid>
);

export default Results;
