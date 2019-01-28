import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import { Link } from "react-router-dom";
import { Box, Typography, Grid } from "@smooth-ui/core-sc";

const AppLink = styled(Typography).attrs({
  uiAs: Link,
  p: "0.5em"
})`
  color: ${props => props.theme.gray300};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.gray100};
  }
`;

const AppBrand = styled(AppLink).attrs({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  to: "/"
})``;

class AppBar extends Component {
  render() {
    return (
      <Box
        display="flex"
        backgroundColor={this.props.theme.gray900}
        alignItems="center"
      >
        <AppBrand>DECSYS</AppBrand>
        <AppLink to="/1">Page 1</AppLink>
        <AppLink to="/2">Page 2</AppLink>
        <Box ml="auto" mr="0.5em" display="flex">
          <AppLink to="/1">Page 1</AppLink>
          <AppLink to="/2">Page 2</AppLink>
        </Box>
      </Box>
    );
  }
}

export default withTheme(AppBar);
