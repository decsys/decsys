import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import path from "path";

import pkg from "./package.json";

const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
  }),
  babel({ ...pkg.babel, exclude: "node_modules/**", babelHelpers: "bundled" }),
  resolve({ preferBuiltins: false }),
  cjs(),
];

const bundleEntryPoint = path.join(__dirname, "src/index.js");
const input = {
  [pkg.name.replace("@", "").replace("/", ".")]: bundleEntryPoint,
  ellipse: path.join(__dirname, "src/ellipse/Scale.js"),
  discrete: path.join(__dirname, "src/discrete/Scale.js"),
};

const entryFileNames = `[name].js`;

export default [
  // browser
  {
    input: bundleEntryPoint,
    output: {
      name: "DECSYS",
      file: path.join(__dirname, pkg.browser),
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React",
      },
    },
    external: ["react"],
    plugins: [...plugins, terser()],
  },
  // commonjs, esm
  // TODO: the esm bundle is broken due to compose-react-refs. needs exploration. cjs is fine.
  {
    input,
    output: [
      {
        dir: path.join(__dirname, "cjs"),
        entryFileNames,
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: path.join(__dirname, "esm"),
        entryFileNames,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: [
      "react",
      "prop-types",
      "@emotion/core",
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
      "@seznam/compose-react-refs",
      "colornames",
      "unit-value",
    ],
    plugins,
  },
];
