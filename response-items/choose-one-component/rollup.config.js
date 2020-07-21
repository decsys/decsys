import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");

// the actual module exports from the bundled IIFE
const footer = `
export const name = DecsysComponent.displayName;
export default DecsysComponent;
`;

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "DecsysComponent",
    file: `dist/${pkg.componentName}.js`,
    sourcemap: true,
    preferConst: true,
    compact: true,
    footer: footer,
    globals: {
      react: "React",
      "styled-components": "styled",
      "react-dom": "ReactDOM",
      "prop-types": "PropTypes",
      "react-wordcloud": "reactWordCloud",
      victory: "Victory",
      mathjs: "math"
    }
  },
  external: [
    "react",
    "styled-components",
    "react-dom",
    "prop-types",
    "react-wordcloud",
    "victory",
    "mathjs"
  ],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: ">0.2%, not dead, not ie <= 11, not op_mini all",
            modules: false
          }
        ],
        "@babel/preset-react"
      ]
    }),
    resolve({ preferBuiltins: false }),
    cjs(),
    json(),
    terser()
  ]
};
