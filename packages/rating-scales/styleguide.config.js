const path = require("path");
const pkg = require("./package.json");

module.exports = {
  styleguideDir: "docs",
  title: "Decsys Rating Scales",

  // very few non-component js files in this repo, so we ignore them this way
  ignore: ["**/pen-line.js", "**/pixi.js"],

  pagePerSection: true,
  sections: [
    {
      name: "README",
      content: "./README.md"
    },
    {
      name: "Core Components",
      content: "src/core/overview.md",
      components: ["src/core/*.js"]
    },
    {
      name: "Discrete Scale",
      content: "src/discrete/overview.md",
      components: ["src/discrete/*.js"]
    },
    {
      name: "Ellipse Scale",
      content: "src/ellipse/overview.md",
      components: ["src/ellipse/*.js"]
    }
  ],

  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    }
  },

  // TODO fix final import pathing
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, ".js");

    const dir = componentPath
      .replace(/src/, `${pkg.name}`)
      .replace(/\\/g, "/")
      .replace(".js", "");
    return `import ${name} from '${dir}';`;
  }
};
