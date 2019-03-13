import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  colorYik,
  yikTextLight,
  colorLevel,
  colorVariant
} from "@smooth-ui/core-sc";
import PropTypes from "prop-types";

const Link = styled(Typography).attrs(p => ({
  as: RouterLink,
  p: "0.5em",
  colors: GetColors(p),
  variant: "light"
}))`
  color: ${({ colors }) => colors.default};
  text-decoration: none;
  &:hover {
    color: ${({ colors }) => colors.hover};
  }
`;

const GetColors = p => {
  const variantColor = colorVariant(p.variant)(p);
  // Yik on the background color to determine if we want light or dark link text
  const LightText = colorYik(variantColor)(p) === yikTextLight(p);

  // colorLevel range is -12 (black) -> 12 (white)
  return {
    default: colorLevel(variantColor, LightText ? -9 : 6),
    hover: colorLevel(variantColor, LightText ? -12 : 12)
  };
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  variant: PropTypes.string
};

export default Link;

// TODO: Yik!
