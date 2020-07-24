import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");

// the actual module exports from the bundled IIFE
const footer = `
export const name = DecsysResponseItem.displayName;
export default DecsysResponseItem;
`;

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "DecsysResponseItem",
    file: `dist/${pkg.responseItemName}.js`,
    sourcemap: true,
    preferConst: true,
    compact: true,
    footer: footer,
    globals: {
      react: "React",
      "prop-types": "PropTypes",
    },
  },
  external: ["react", "prop-types"],
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
            targets: ">0.2%, not dead, not ie <= 11, not op_mini all",
            modules: false,
          },
        ],
        "@babel/preset-react",
      ],
      babelHelpers: "bundled", // TODO: we can probably make this "runtime"
    }),
    resolve({ preferBuiltins: false }),
    cjs(),
    json(),
    terser(),
  ],
};
