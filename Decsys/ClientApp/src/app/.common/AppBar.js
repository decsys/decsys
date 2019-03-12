import React from "react";
import styled, { withTheme } from "styled-components";
import { Link } from "react-router-dom";
import { Typography } from "@smooth-ui/core-sc";
import FlexBox from "../FlexBox";
import Container from "./common/Container";

const AppBarLink = styled(Typography).attrs({
  uiAs: Link,
  p: "0.5em"
})`
  color: ${props => props.theme.gray500};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.gray100};
  }
`;

const AppBarBrand = styled(AppBarLink).attrs({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  to: "/"
})``;

const AppBar = props => (
  <FlexBox backgroundColor={props.theme.gray900} alignItems="center">
    <Container>
      <FlexBox alignItems="center" justifyContent="space-between">
        <AppBarBrand>DECSYS</AppBarBrand>
        <AppBarLink to="/about">About</AppBarLink>
      </FlexBox>
    </Container>
  </FlexBox>
);

export default withTheme(AppBar);
