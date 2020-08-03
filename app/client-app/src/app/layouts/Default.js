import React from "react";
import DefaultAppBar from "./components/DefaultAppBar";
import DefaultContainer from "../../components/shared/DefaultContainer";
import { Grid } from "@chakra-ui/core";

const Default = ({ children, brandLink }) => {
  return (
    <Grid templateRows="54px minmax(20px, 1fr)" height="100vh">
      <DefaultAppBar brandLink={brandLink} />
      <DefaultContainer>{children}</DefaultContainer>
    </Grid>
  );
};

export default Default;
