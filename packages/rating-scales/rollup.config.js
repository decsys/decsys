import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify("production")
  }),
  babel({ ...pkg.babel, exclude: "node_modules/**" }),
  resolve({ preferBuiltins: false }),
  cjs(),
  terser()
];

const bundleEntryPoint = "src/index.js";
const input = {
  [pkg.name.replace("@", "").replace("/", ".")]: bundleEntryPoint,
  ellipse: "src/ellipse/Scale.js",
  discrete: "src/discrete/Scale.js"
};

const entryFileNames = `[name].js`;

export default [
  // browser
  {
    input: bundleEntryPoint,
    output: {
      name: "DECSYS",
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React",
        "styled-components": "styled"
      }
    },
    external: ["react", "styled-components"],
    plugins
  },
  // commonjs, esm
  {
    input,
    output: [
      {
        dir: "cjs",
        entryFileNames,
        format: "cjs",
        sourcemap: true,
        globals: {
          react: "React",
          "styled-components": "styled"
        }
      },
      {
        dir: "esm",
        entryFileNames,
        format: "esm",
        sourcemap: true,
        globals: {
          react: "React",
          "styled-components": "styled"
        }
      }
    ],
    external: [
      "react",
      "styled-components",
      "prop-types",
      "@pixi/app",
      "@pixi/constants",
      "@pixi/core",
      "@pixi/display",
      "@pixi/graphics",
      "@pixi/interaction",
      "@pixi/math",
      "@pixi/runner",
      "@pixi/settings",
      "@pixi/ticker",
      "@pixi/utils",
      "colornames",
      "unit-value"
    ],
    plugins
  }
];
