import styled from "styled-components";
import { Typography, colorYik, colorVariant } from "@smooth-ui/core-sc";

const Badge = styled(Typography).attrs(
  ({ backgroundColor = "info", ...p }) => ({
    display: "inline",
    px: 1,
    borderRadius: 8,
    textAlign: "center",
    backgroundColor: backgroundColor,
    color: colorYik(colorVariant(backgroundColor)(p))(p)
  })
)``;

export default Badge;
