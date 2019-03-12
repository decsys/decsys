import styled from "styled-components";
import PropTypes from "prop-types";
import Link from "./Link";

const Brand = styled(Link).attrs({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  to: "/"
})``;

Brand.propTypes = {
  theme: PropTypes.shape({})
};

export default Brand;
