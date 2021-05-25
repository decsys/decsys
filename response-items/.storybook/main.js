const path = require("path");
const config = require("@decsys/config");
const { stories, addons, webpackConfig } = config.storybook;

// need to fetch alias target package path manually due to Yarn PNP
const ratingScalesMain = path.dirname(
  require.resolve("@decsys/rating-scales/package.json")
);

module.exports = {
  stories,
  addons,
  webpackFinal: webpackConfig(config.responseItemBabel, {
    // we alias specific exports from `rating-scales` to the main export
    // because storybook today (using webpack4) doesn't support the `package.exports` field
    // but rollup does, and it makes our bundles smaller.
    // so the source uses the specific exports
    // while SB uses the general, aliased by this webpack config
    "@decsys/rating-scales/vas": ratingScalesMain,
    "@decsys/rating-scales/mvas": ratingScalesMain,
    "@decsys/rating-scales/ellipse": ratingScalesMain,
    "@decsys/rating-scales/discrete": ratingScalesMain,
  }),
};
