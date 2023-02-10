const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const babelConfig = require("./package.json").babel;

module.exports = {
  babel: {
    presets: babelConfig.presets,
    plugins: babelConfig.plugins,
  },
  eslint: {
    configure: (config) => {
      config.rules = {
        ...config.rules,
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
      };
      return config;
    },
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
