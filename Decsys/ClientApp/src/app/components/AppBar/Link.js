import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Typography } from "@smooth-ui/core-sc";
import PropTypes from "prop-types";

const Link = styled(Typography).attrs({
  as: RouterLink,
  p: "0.5em"
})`
  color: ${({ theme }) => theme.gray500};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.gray100};
  }
`;

Link.propTypes = {
  to: PropTypes.string.isRequired
};

export default Link;
