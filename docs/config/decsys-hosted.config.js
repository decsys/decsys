const { buildNavbarConfig, buildFooterConfig } = require("./helpers");
const config = require("./default.config");

module.exports = {
  ...config,
  onBrokenLinks: "warn", // we have some deliberate "broken" links (see "../" below) but warnings are good to look for real ones!
  baseUrl: "/docs/",
  themeConfig: {
    navbar: buildNavbarConfig({
      title: "Back to DECSYS",
      logoHref: "../", // this is relative to baseUrl
    }),
    footer: buildFooterConfig(),
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        pages: false,
        blog: false,
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/decsys/decsys/edit/master/docs/",
        },
      },
    ],
  ],
};
