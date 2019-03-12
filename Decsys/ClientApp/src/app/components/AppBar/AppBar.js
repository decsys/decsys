import React from "react";
import { withTheme } from "styled-components";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import Container from "../ui/Container";
import AppBarBrand from "./AppBarBrand";

const AppBar = ({ theme, brand, children }) => (
  <FlexBox backgroundColor={theme.gray900} alignItems="center">
    <Container>
      <FlexBox alignItems="center" justifyContent="space-between">
        <AppBarBrand>{brand}</AppBarBrand>
        {children}
      </FlexBox>
    </Container>
  </FlexBox>
);

AppBar.propTypes = {
  theme: PropTypes.shape({})
};

export default withTheme(AppBar);
