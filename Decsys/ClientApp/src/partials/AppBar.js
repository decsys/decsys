import React from "react";
import styled, { withTheme } from "styled-components";
import { Link } from "react-router-dom";
import { Box, Typography, Grid, Row } from "@smooth-ui/core-sc";

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
  <Box display="flex" backgroundColor={props.theme.gray900} alignItems="center">
    <Grid>
      <Row>
        <AppBarBrand>DECSYS</AppBarBrand>

        <Box uiAs="nav" ml="auto" mr="0.5em" display="flex" alignItems="center">
          <AppBarLink to="/about">About</AppBarLink>
        </Box>
      </Row>
    </Grid>
  </Box>
);

export default withTheme(AppBar);
