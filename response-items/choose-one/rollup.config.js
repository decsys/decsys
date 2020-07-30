import resolve from "@rollup/plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import path from "path";

const pkg = require("./package.json");

// the actual module exports from the bundled IIFE
const footer = `
export const name = DecsysResponseItem.displayName;
export default DecsysResponseItem;
`;

export default {
  input: path.join(__dirname, "src/index.js"),
  output: {
    format: "iife",
    name: "DecsysResponseItem",
    file: path.join(__dirname, `dist/${pkg.responseItemName}.js`),
    sourcemap: true,
    preferConst: true,
    compact: true,
    footer,
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "prop-types": "PropTypes",
      "@emotion/core": "EmotionCore",
      "@emotion/css": "EmotionCore.css",
    },
  },
  external: [
    "react",
    "react-dom",
    "prop-types",
    "@emotion/core",
    "@emotion/css",
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: ">0.2%, not dead, not ie <= 11, not op_mini all",
            modules: false,
          },
        ],
        "@babel/preset-react",
        "@emotion/babel-preset-css-prop",
      ],
      babelHelpers: "bundled",
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    resolve({ preferBuiltins: false }),
    cjs(),
    json(),
    terser(),
  ],
};
