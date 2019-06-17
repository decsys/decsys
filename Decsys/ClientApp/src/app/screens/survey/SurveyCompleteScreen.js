import React from "react";
import AppBar from "../../components/AppBar";
import { Container, FlexBox, EmptyState } from "../../components/ui";
import { Check } from "styled-icons/fa-solid";
import AboutLink from "../../components/AboutLink";

const SurveyCompleteScreen = () => (
  <>
    <AppBar brand="DECSYS" brandLink="#">
      <AboutLink />
    </AppBar>
    <Container>
      <FlexBox mt={5}>
        <EmptyState message="Survey Complete!" splash={<Check />} />
      </FlexBox>
    </Container>
  </>
);

export default SurveyCompleteScreen;
