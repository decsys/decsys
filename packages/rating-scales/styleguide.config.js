const path = require("path");
const pkg = require("./package.json");

module.exports = {
  styleguideDir: "docs",
  title: "Decsys Rating Scales",

  // TODO fix final import pathing
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, ".js");

    const dir = componentPath
      .replace(/src/, `${pkg.name}`)
      .replace(/\\/g, "/")
      .replace(".js", "");
    return `import ${name} from '${dir}';`;
  },
  // very few non-component js files in this repo, so we ignore them this way
  ignore: ["**/pen-line.js"],

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
      name: "Likert Scale",
      content: "src/likert/overview.md",
      components: ["src/likert/*.js"]
    },
    {
      name: "Ellipse Scale",
      content: "src/ellipse/overview.md",
      components: ["src/ellipse/*.js"]
    }
  ]
};
