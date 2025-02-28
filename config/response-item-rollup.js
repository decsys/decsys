const path = require("path");

/**
 * The footer we append to the bundle.
 * This provides ESM exports from the IIFE that rollup builds.
 * The browser can then import this bundle directly (which DECSYS does)
 */
const footer = `
export const name = DecsysResponseItem.displayName;
export default DecsysResponseItem;
`;

/**
 * The banner prepended to the rollup output.
 * Mainly to Timestamp the build for caching checks.
 * `@preserve` prevents terser from removing this comment.
 * @param {*} responseItemName The name of the response item, usually from package.json
 */
const banner = (responseItemName) =>
  `/* @preserve ${responseItemName} - ${new Date().toISOString()} */`;

/**
 * Default configurations for likely plugins
 */
const pluginConfigs = {
  replace: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  },
  babel: {
    exclude: "node_modules/**",
    babelHelpers: "bundled",
  },
  resolve: {
    preferBuiltins: false,
    extensions: [".mjs", ".js", ".json", ".node", ".jsx"],
  },
};

/**
 * Default (shared) rollup config for response items
 * @param {*} responseItemName The name of the response item
 * @param {*} dirname The `__dirname` value for the calling script
 * @param {*} entryDir The path to the directory containing `index.js`, relative to `__dirname`
 */
const buildRollupConfig = (responseItemName, dirname, entryDir) => ({
  input: path.join(dirname, entryDir, "index.js"),
  output: {
    format: "iife",
    name: "DecsysResponseItem",
    file: path.join(dirname, `../dist/${responseItemName}.js`),
    sourcemap: true,
    preferConst: true,
    compact: true,
    banner: banner(responseItemName),
    footer,
    // items will want to add further globals
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      "prop-types": "PropTypes",
    },
  },
  // items will want to add further externals
  external: ["react", "react-dom", "prop-types"],
  // plugins are added by the actual item's rollup config
  // to simplify imports.
  // They can use default configs exported above.
  //plugins: [
  // replace(pluginConfigs.replace),
  // babel({
  //   ...pkg.babel,
  //   ...pluginConfigs.babel
  // }),
  // resolve(pluginConfigs.resolve),
  // cjs(),
  // json(),
  // terser(),
  // ],
  onwarn: (warning) => {
    // we actually want builds to FAIL on warnings
    // not make spurious decisions for us
    // like adding unresolved dependencies to externals
    throw new Error(warning.message);
  },
});

module.exports = {
  pluginConfigs,
  buildRollupConfig,
};
