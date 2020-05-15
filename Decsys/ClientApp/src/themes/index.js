import { theme } from "@chakra-ui/core";
import merge from "lodash-es/merge";

const decsysTheme = {
  colors: {
    "dark-gray": {
      "50": "#f2f2f2",
      "100": "#cccccc",
      "200": "#a6a6a6",
      "300": "#7f7f7f",
      "400": "#595959",
      "500": "#333333",
      "600": "#292929",
      "700": "#202020",
      "800": "#161616",
      "900": "#0d0d0d"
    }
  }
};

export default merge(theme, decsysTheme);

// export default {
//   ...theme,
//   name: "decsys",
//   //overrides here
//   primary: th("blue"),

//   //new theme colors here
//   uiPanel1: th("gray900"),
//   uiPanel2: th("gray500"),
//   cardBg: th("light"),
//   cardHighlightBg: "#9ebced",
//   cardHoverBg: "#d8e4ff",
//   cardBorder: th("gray400"),
//   menuBg: th("light"),
//   menuItem: th("light"),
//   lightest: th("white"), //swap light and dark for dark themes... so it's relatively inverted?
//   darkest: "#111",

//   // also need to add new colors here for variants to work
//   colors: {
//     ...theme.colors,
//     uiPanel1: th("uiPanel1"),
//     uiPanel2: th("uiPanel2"),
//     cardBg: th("cardBg"),
//     cardHighlightBg: th("cardHighlightBg"),
//     cardHoverBg: th("cardHoverBg"),
//     cardBorder: th("cardBorder"),
//     menuBg: th("menuBg"),
//     menuItem: th("menuItem"),
//     lightest: th("lightest"),
//     darkest: th("darkest")
//   }
// };
