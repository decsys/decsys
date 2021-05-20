const config = require("@decsys/config");
const { stories, addons, webpackConfig } = config.storybook;

module.exports = {
  stories,
  addons,
  webpackFinal: webpackConfig(config.responseItemBabel),
};
