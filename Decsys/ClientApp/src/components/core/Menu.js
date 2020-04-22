import FlexBox from "./FlexBox";
import styled from "styled-components";

const DropdownMenu = styled(FlexBox).attrs(props => ({
  backgroundColor: "menuBg",
  border: 1,
  borderColor: props.theme.gray400,
  borderRadius: 5,
  flexDirection: "column",
  py: 1
}))`
  position: absolute;
  z-index: 10;
  min-width: 10em;
`;

export default DropdownMenu;
