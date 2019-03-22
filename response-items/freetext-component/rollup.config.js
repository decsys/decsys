import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";

const pkg = require('./package.json');

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "DecsysComponent",
    file: `dist/${pkg.bundle}.js`,
    exports: "named", // explicitly set default export as a `<name>.default` named export
    globals: {
      react: "React",
      "styled-components": "styled",
      "prop-types": "PropTypes"
    }
  },
  external: ["react", "styled-components", "prop-types"],
  plugins: [resolve(), cjs()]
};
