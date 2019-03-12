import styled from "styled-components";
import AppBarLink from "./AppBarLink";

const AppBarBrand = styled(AppBarLink).attrs({
  variant: "h4",
  display: "inline",
  mb: ".1rem",
  to: "/"
})``;

export default AppBarBrand;
