const { buildNavbarConfig, buildFooterConfig } = require("./helpers");
const config = require("./default.config");

const finalConfig = {
  ...config,
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

console.log(JSON.stringify(finalConfig, null, 2));

module.exports = finalConfig;
