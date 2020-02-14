import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "./Link";

const Brand = styled(Link).attrs(({ href }) => ({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  href: `${href || "/"}`
}))``;

Brand.propTypes = {
  variant: PropTypes.string.isRequired
};

export default Brand;
