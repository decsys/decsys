import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import Container from "../ui/Container";
import Brand from "./Brand";
import { Grid } from "styled-css-grid";

const AppBar = ({ brand, children }) => (
  <FlexBox backgroundColor="gray900" alignItems="center">
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
  brand: PropTypes.string,
  children: PropTypes.oneOf([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
};

export default AppBar;
