import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Typography } from "@smooth-ui/core-sc";
import PropTypes from "prop-types";

const Link = styled(Typography).attrs({
  uiAs: RouterLink,
  p: "0.5em"
})`
  color: ${props => props.theme.gray500};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.gray100};
  }
`;

Link.propTypes = {
  theme: PropTypes.shape({}),
  to: PropTypes.string.isRequired
};

export default Link;
