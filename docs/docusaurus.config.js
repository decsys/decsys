module.exports = {
  title: "DECSYS",
  tagline: "DISCRETE AND ELLIPSE-BASED RESPONSE CAPTURE SYSTEM",
  url: "https://your-docusaurus-test-site.com",
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
              to: "docs/devs/custom-responses",
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
          label: "Packages",
          position: "left",
          items: [
            {
              to: "docs/pkg/param-types",
              label: "Param Types",
            },
            {
              to: "docs/pkg/rating-scales",
              label: "Rating Scales",
            },
            {
              label: "Response Items",
              items: [
                {
                  to: "docs/pkg/response-items",
                  label: "test",
                },
              ],
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
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "docs/",
            },
            {
              label: "Second Doc",
              to: "docs/doc2/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DECSYS. Built with Docusaurus.`,
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
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/",
        },
      },
    ],
  ],
};
