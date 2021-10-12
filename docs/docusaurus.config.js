const { buildNavbarConfig, buildFooterConfig } = require("./config/helpers");

const docsRoutePrefix = "docs";

module.exports = {
  title: "DECSYS",
  tagline: "DISCRETE AND ELLIPSE-BASED RESPONSE CAPTURE SYSTEM",
  url: "https://decsys.github.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "decsys", // Usually your GitHub org/user name.
  projectName: "decsys", // Usually your repo name.
  themeConfig: {
    navbar: buildNavbarConfig({
      docsRoutePrefix,
    }),
    footer: buildFooterConfig(docsRoutePrefix),
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        blog: false,
        docs: {
          sidebarPath: require.resolve("./config/sidebars.js"),
          editUrl: "https://github.com/decsys/decsys/edit/master/docs/",
        },
      },
    ],
  ],
};
