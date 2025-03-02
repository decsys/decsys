import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import polyfillNode from "rollup-plugin-polyfill-node";
import { responseItemName } from "../src/ellipse-scale/metadata";

const sharedConfig = require("@decsys/config");
const { pluginConfigs, buildRollupConfig } = sharedConfig.responseItemRollup;
const config = buildRollupConfig(
  responseItemName,
  __dirname,
  "../src/ellipse-scale"
);

// Add item specific globals
config.output.globals = {
  ...config.output.globals,
  mathjs: "math",
};

// Add item specific externals
config.external = [...config.external, "mathjs"];

// Add plugins
config.plugins = [
  polyfillNode(),
  replace(pluginConfigs.replace),
  babel({
    ...sharedConfig.responseItemBabel,
    ...pluginConfigs.babel,
  }),
  resolve(pluginConfigs.resolve),
  cjs(),
  json(),
  terser(),
];

export default config;
