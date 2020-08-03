const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = {
  babel: {
    presets: ["@emotion/babel-preset-css-prop"],
  },
  webpack: {
    alias: {},
    plugins: [],
    //configure: { /* Any webpack configuration options: https://webpack.js.org/configuration */ },
    configure: (config, { env, paths }) => {
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );
      return config;
    },
  },
};
