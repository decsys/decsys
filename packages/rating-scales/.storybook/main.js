const babelConfig = require("../package.json").babel;

module.exports = {
  stories: ["../src/**/*.stories.js"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-storysource",
    "@storybook/addon-backgrounds",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules[0].use[0].options = {
      ...config.module.rules[0].use[0].options,
      ...babelConfig,
    };

    // Return the altered config
    return config;
  },
};
