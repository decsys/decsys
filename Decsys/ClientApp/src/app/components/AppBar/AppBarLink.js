import styled from "styled-components";
import { Link } from "react-router-dom";
import { Typography } from "@smooth-ui/core-sc";
import PropTypes from "prop-types";

const AppBarLink = styled(Typography).attrs({
  uiAs: Link,
  p: "0.5em"
})`
  color: ${props => props.theme.gray500};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.gray100};
  }
`;

AppBarLink.propTypes = {
  theme: PropTypes.shape({}),
  to: PropTypes.string.isRequired
};

export default AppBarLink;
