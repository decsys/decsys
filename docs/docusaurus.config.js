const baseConfig = {
  title: "DECSYS",
  tagline: "DISCRETE AND ELLIPSE-BASED RESPONSE CAPTURE SYSTEM",
  url: "https://decsys.github.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "decsys", // Usually your GitHub org/user name.
  projectName: "decsys", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "DECSYS",
      logo: {
        alt: "My Site Logo",
        src: "img/favicon.ico",
      },
      items: [
        {
          activeBaseRegex: "docs/users",
          to: "docs/users/overview",
          label: "User Guide",
          position: "left",
        },
        {
          activeBasePath: "docs/devs",
          to: "/",
          label: "Developers",
          position: "left",
          items: [
            {
              activeBasePath: "docs/custom-responses",
              to: "docs/devs/custom-responses/getting-started",
              label: "Creating Custom Responses",
            },
            {
              activeBasePath: "docs/devs/contributing",
              to: "docs/devs/contributing/source-code",
              label: "Contributing to DECSYS",
            },
            {
              activeBasePath: "docs/devs/technical",
              to: "docs/devs/technical/architecture",
              label: "Technical Reference",
            },
          ],
        },
        {
          activeBasePath: "docs/pkg",
          to: "/",
          label: "Packages",
          position: "left",
          items: [
            {
              to: "docs/pkg/param-types/overview",
              label: "Param Types",
            },
            {
              to: "docs/pkg/rating-scales/overview",
              label: "Rating Scales",
            },
            {
              label: "Response Items",
              to: "docs/pkg/response-items/overview",
            },
          ],
        },

        {
          href: "https://github.com/decsys/decsys",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "User Guide",
          items: [
            {
              label: "Overview",
              to: "docs/users/overview",
            },
            {
              label: "Getting Started",
              to: "docs/users/installation",
            },
          ],
        },
        {
          title: "Developer Guide",
          items: [
            {
              label: "Create Custom Responses",
              to: "docs/devs/custom-responses/getting-started",
            },
            {
              label: "Contributing to DECSYS",
              to: "docs/devs/contributing/source-code",
            },
            {
              label: "Platform Technical Reference",
              to: "docs/devs/technical/architecture",
            },
          ],
        },
        {
          title: "Packages Reference",
          items: [
            {
              label: "Param Types",
              to: "docs/pkg/param-types/overview",
            },
            {
              label: "Rating Scales",
              to: "docs/pkg/rating-scales/overview",
            },
            {
              label: "Response Items",
              to: "docs/pkg/response-items/overview",
            },
          ],
        },
        {
          title: "Information",
          items: [
            {
              label: "LUCID",
              href: "https://www.lucidresearch.org/decsys.html",
            },
            {
              label: "GitHub",
              href: "https://github.com/decsys/decsys",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DECSYS.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          //homePageId: "users/overview",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/decsys/decsys/edit/master/docs/",
        },
      },
    ],
  ],
};

const targetConfigs = {
  ghPages: {
    //url: "https://decsys.github.io",
  },
  selfHosted: {
    baseUrl: "/docs/",
  },
};

module.exports = {
  ...baseConfig,
  ...targetConfigs[process.env.TARGET],
};
