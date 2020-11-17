const { stories, addons, webpackConfig } = require("@decsys/config").storybook;

const babelConfig = require("../package.json").babel;

module.exports = {
  stories,
  addons,
  webpackFinal: webpackConfig(babelConfig),
};
