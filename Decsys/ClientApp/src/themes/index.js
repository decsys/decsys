import { theme } from "@chakra-ui/core";
import merge from "lodash-es/merge";

const overrides = {
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
  },
  shadows: {
    callout: "0 2px 10px 0 rgba(0,0,0,.132), 0 0.5px 1.8px 0 rgba(0,0,0,.108)",
    "section-h": "0 2px 10px 0 rgba(0,0,0,.2), 0 1px 1.8px 0 rgba(0,0,0,.5)",
    "section-v": "2px 0 10px 0 rgba(0,0,0,.2), 1px 0 1.8px 0 rgba(0,0,0,.5)"
  }
};

export default merge(theme, overrides);
