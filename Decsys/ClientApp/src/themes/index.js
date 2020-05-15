import { theme } from "@chakra-ui/core";
import merge from "lodash-es/merge";

const decsysTheme = {
  colors: {
    "dark-gray": {
      "50": "#f0f1f5",
      "100": "#c1c8d7",
      "200": "#939fb9",
      "300": "#65769b",
      "400": "#47536d",
      "500": "#29303f",
      "600": "#212733",
      "700": "#1a1e27",
      "800": "#12151b",
      "900": "#0a0c0f"
    }
  }
};

export default merge(theme, decsysTheme);
