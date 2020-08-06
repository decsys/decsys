const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.js"],
  addons: [
    "@storybook/preset-create-react-app",
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
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
      // Emotion preset must run BEFORE reacts preset to properly convert css-prop.
      // Babel preset-ordering runs reversed (from last to first). Emotion has to be after React preset.
      require.resolve("@emotion/babel-preset-css-prop"),
    ];

    // CRA's absolute imports?
    config.resolve.modules.push(path.resolve(__dirname, "../src"));

    // Return the altered config
    return config;
  },
};
