import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import analyze from "rollup-plugin-analyzer";

import { responseItemName } from "../src/visual-analog-scale/metadata";
const sharedConfig = require("@decsys/config");
const { pluginConfigs, buildRollupConfig } = sharedConfig.responseItemRollup;
const config = buildRollupConfig(
  responseItemName,
  __dirname,
  "../src/visual-analog-scale"
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
  replace(pluginConfigs.replace),
  babel({
    ...sharedConfig.responseItemBabel,
    ...pluginConfigs.babel,
  }),
  resolve(pluginConfigs.resolve),
  cjs(),
  json(),
  terser(),
  analyze(),
];

export default config;
