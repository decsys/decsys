import React from "react";
import { Grid } from "@smooth-ui/core-sc";

/**
 * Mimics a Bootstrap responsive fixed-width container
 * by using SmoothUI's Grid with no gutter.
 *
 * There's no expectation or need to continue using Smooth's Grid layout inside.
 */
const Container = ({ children }) => <Grid gutter={0}>{children}</Grid>;

export default Container;
