import React from "react";
import PropTypes from "prop-types";
import FlexBox from "../ui/FlexBox";
import Container from "../ui/Container";
import Brand from "./Brand";
import { Grid } from "styled-css-grid";

const AppBar = ({ brand, children, variant }) => {
  return (
    <FlexBox backgroundColor={variant} alignItems="center">
      <Container>
        <FlexBox alignItems="center" justifyContent="space-between">
          <Brand variant={variant}>{brand}</Brand>
          {children != null && (
            <Grid
              columns={Array(children.length)
                .fill("auto")
                .join(" ")}
            >
              {children.map(x => ({
                ...x,
                props: { ...x.props, variant: x.props.variant || variant }
              }))}
            </Grid>
          )}
        </FlexBox>
      </Container>
    </FlexBox>
  );
};

AppBar.propTypes = {
  brand: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  variant: PropTypes.string
};
AppBar.defaultProps = {
  variant: "uiPanel1"
};

export default AppBar;
