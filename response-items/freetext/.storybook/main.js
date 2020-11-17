const { storybook } = require("config");

const babelConfig = require("../package.json").babel;

module.exports = {
  stories: storybook.stories,
  addons: storybook.addons,
  webpackFinal: storybook.webpackConfig(babelConfig),
};
