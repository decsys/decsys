import styled from "styled-components";
import PropTypes from "prop-types";
import AppBarLink from "./AppBarLink";

const AppBarBrand = styled(AppBarLink).attrs({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  to: "/"
})``;

AppBarBrand.propTypes = {
  theme: PropTypes.shape({})
};

export default AppBarBrand;
