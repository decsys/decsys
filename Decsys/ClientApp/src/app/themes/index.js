import { theme, th } from "@smooth-ui/core-sc";

export default {
  ...theme,
  name: "decsys",
  //overrides here
  primary: th("blue"),

  //new theme colors here
  uiPanel1: th("gray900"),
  uiPanel2: th("gray500"),
  cardBg: th("light"),
  cardHighlightBg: "#9ebced",
  cardHoverBg: "#d8e4ff",
  cardBorder: th("gray400"),
  menuBg: th("light"),
  menuItem: th("light"),

  // also need to add new colors here for variants to work
  colors: {
    ...theme.colors,
    uiPanel1: th("uiPanel1"),
    uiPanel2: th("uiPanel2"),
    cardBg: th("cardBg"),
    cardHighlightBg: th("cardHighlightBg"),
    cardHoverBg: th("cardHoverBg"),
    cardBorder: th("cardBorder"),
    menuBg: th("menuBg"),
    menuItem: th("menuItem")
  }
};
