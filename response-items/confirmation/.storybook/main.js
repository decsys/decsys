const babelConfig = require("../package.json").babel;
const { stories, addons, webpackConfig } = require("@decsys/config").storybook;

module.exports = {
  stories,
  addons,
  webpackFinal: webpackConfig(babelConfig),
};
