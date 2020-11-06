import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
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
const banner = `/* @preserve ${
  pkg.responseItemName
} - ${new Date().toISOString()} */`;

export default {
  input: path.join(__dirname, "src/index.js"),
  output: {
    format: "iife",
    name: "DecsysResponseItem",
    file: path.join(__dirname, `dist/${pkg.responseItemName}.js`),
    sourcemap: true,
    preferConst: true,
    compact: true,
    banner,
    footer,
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "prop-types": "PropTypes",
      mathjs: "math",
    },
  },
  external: ["react", "react-dom", "prop-types", "mathjs"],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "supports es6-module-dynamic-import",
            modules: false,
          },
        ],
        "@babel/preset-react",
      ],
      babelHelpers: "bundled",
    }),
    resolve({ preferBuiltins: false }),
    cjs(),
    json(),
    terser(),
  ],
  onwarn: (warning) => {
    // we actually want builds to FAIL on warnings
    // not make spurious decisions for us
    // like adding unresolved dependencies to externals
    throw new Error(warning.message);
  },
};
