import React from "react";
import { withTheme } from "styled-components";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import Container from "../ui/Container";
import Brand from "./Brand";
import { Grid } from "styled-css-grid";

const AppBar = ({ theme, brand, children }) => (
  <FlexBox backgroundColor={theme.gray900} alignItems="center">
    <Container>
      <FlexBox alignItems="center" justifyContent="space-between">
        <Brand>{brand}</Brand>
        {children != null && (
          <Grid
            columns={Array(children.length)
              .fill("auto")
              .join(" ")}
          >
            {children}
          </Grid>
        )}
      </FlexBox>
    </Container>
  </FlexBox>
);

AppBar.propTypes = {
  theme: PropTypes.shape({}),
  brand: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node)
};

export default withTheme(AppBar);
