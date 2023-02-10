const path = require("path");
const babelConfig = require("../package.json").babel;
const { stories, addons, webpackConfig } = require("@decsys/config").storybook;

module.exports = {
  stories,
  addons: ["@storybook/preset-create-react-app", ...addons],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config = await webpackConfig(babelConfig)(config, { configType });

    // CRA's absolute imports?
    config.resolve.modules.push(path.resolve(__dirname, "../src"));

    // Return the altered config
    return config;
  },
};
