const path = require("path");

module.exports = {
  stories: ["../src/stories/**/*.stories.js"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-storysource"
  ]
};
