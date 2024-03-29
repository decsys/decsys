import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

import { responseItemName } from "../src/choose-many/metadata";
const sharedConfig = require("@decsys/config");
const { pluginConfigs, buildRollupConfig } = sharedConfig.responseItemRollup;
const config = buildRollupConfig(
  responseItemName,
  __dirname,
  "../src/choose-many"
);

// Add item specific globals
config.output.globals = {
  ...config.output.globals,
  "@chakra-ui/react": "Chakra",
};

// Add item specific externals
config.external = [...config.external, "@chakra-ui/react"];

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
];

export default config;
