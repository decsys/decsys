import React from "react";
import { Container } from "../../components/ui";
import AppBar from "../../components/AppBar";
import { Typography } from "@smooth-ui/core-sc";

const DashboardScreen = ({ survey, instance }) => {
  return (
    <>
      <AppBar brand="DECSYS" />
      <Container>
        <Typography my={2} variant="h2">
          {survey.name}
        </Typography>
        <Typography mb={2} variant="h3">
          Dashboard for {instance.published}
        </Typography>
      </Container>
    </>
  );
};

export default DashboardScreen;
