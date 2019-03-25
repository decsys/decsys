import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { FlexBox, Container } from "../ui";
import Brand from "./Brand";
import { Grid } from "styled-css-grid";

const AppBar = ({ brand, children, variant, brandLink }) => {
  return (
    <FlexBox backgroundColor={variant} alignItems="center">
      <Container>
        <FlexBox alignItems="center" justifyContent="space-between">
          <Brand variant={variant} to={brandLink}>
            {brand}
          </Brand>
          {children != null && (
            <Grid
              columns={Array(children.length || 1)
                .fill("auto")
                .join(" ")}
            >
              {children.length
                ? children.map(x => ({
                    ...x,
                    props: { ...x.props, variant: x.props.variant || variant }
                  }))
                : cloneElement(children, {
                    variant: children.props.variant || variant
                  })}
            </Grid>
          )}
        </FlexBox>
      </Container>
    </FlexBox>
  );
};

AppBar.propTypes = {
  brandLink: PropTypes.string,
  brand: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  variant: PropTypes.string
};
AppBar.defaultProps = {
  variant: "uiPanel1",
  brandLink: "/"
};

export default AppBar;
