const path = require("path");

const webpackConfig =
  (babelConfig, aliases = {}) =>
  async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules[0].use[0].options = {
      ...config.module.rules[0].use[0].options,
      ...babelConfig,
    };

    // until storybook supports emotion 11 by itself, alias 10 to 11.
    const emotionReactEleven = path.dirname(
      require.resolve("@emotion/react/package.json")
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      "@emotion/core": emotionReactEleven,
      "emotion-theming": emotionReactEleven,
      ...aliases,
    };

    // Return the altered config
    return config;
  };

const stories = ["../src/**/*.stories.js"];

// TODO: this may need amending to find the common set
const addons = [
  "@storybook/addon-actions",
  "@storybook/addon-knobs",
  "@storybook/addon-links",
  "@storybook/addon-storysource",
  "@storybook/addon-backgrounds",
];

module.exports = {
  webpackConfig,
  stories,
  addons,
};
