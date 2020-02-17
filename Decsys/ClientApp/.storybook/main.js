const path = require("path");

module.exports = {
  stories: ["../src/stories/**/*.stories.js"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "storybook-addon-styled-component-theme/dist/register"
  ]
  // webpackFinal: config => {
  //   config.resolve.modules.push(path.resolve(__dirname, "../src"));
  //   console.dir(config, { depth: null }) || config;
  //   return config;
  // }
};
