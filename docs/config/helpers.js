const buildDocsRoute = (route, prefix) => {
  prefix = prefix ? `${prefix}/` : "";
  return prefix + route || "/";
};

/**
 * Gets navbar links right given changing docs routes,
 * allows other navbar customisation
 */
const buildNavbarConfig = ({ title, docsRoutePrefix, logoHref }) => {
  const config = {
    title: title ?? "DECSYS",
    logo: {
      alt: "DECSYS checkmark icon",
      src: "img/favicon.ico",
    },
    items: [
      {
        activeBaseRegex: buildDocsRoute("users", docsRoutePrefix),
        to: buildDocsRoute("", docsRoutePrefix),
        label: "User Guide",
        position: "left",
      },
      {
        activeBasePath: buildDocsRoute("devs", docsRoutePrefix),
        to: buildDocsRoute("devs/technical/architecture", docsRoutePrefix), // TODO: Devs landing page?
        label: "For Developers",
        position: "left",
        items: [
          {
            activeBasePath: buildDocsRoute(
              "devs/custom-responses",
              docsRoutePrefix
            ),
            to: buildDocsRoute(
              "devs/custom-responses/getting-started",
              docsRoutePrefix
            ),
            label: "Creating Custom Responses",
          },
          {
            activeBasePath: buildDocsRoute(
              "devs/contributing",
              docsRoutePrefix
            ),
            to: buildDocsRoute(
              "devs/contributing/source-code",
              docsRoutePrefix
            ),
            label: "Contributing to DECSYS",
          },
          {
            activeBasePath: buildDocsRoute("devs/technical", docsRoutePrefix),
            to: buildDocsRoute("devs/technical/architecture", docsRoutePrefix),
            label: "Technical Reference",
          },
        ],
      },
      {
        activeBasePath: buildDocsRoute("pkg", docsRoutePrefix),
        to: buildDocsRoute("pkg/response-items/overview", docsRoutePrefix), // TODO Packages landing page?
        label: "Packages",
        position: "left",
        items: [
          {
            to: buildDocsRoute("pkg/param-types/overview", docsRoutePrefix),
            label: "Param Types",
          },
          {
            to: buildDocsRoute("pkg/rating-scales/overview", docsRoutePrefix),
            label: "Rating Scales",
          },
          {
            label: "Response Items",
            to: buildDocsRoute("pkg/response-items/overview", docsRoutePrefix),
          },
        ],
      },

      {
        href: "https://github.com/decsys/decsys",
        label: "GitHub",
        position: "right",
      },
    ],
  };

  if (logoHref) {
    config.logo.href = logoHref;
    config.logo.target = "_self";
  }

  return config;
};

/**
 * Gets footer links right given changing docs routes
 */
const buildFooterConfig = (docsRoutePrefix) => ({
  style: "dark",
  links: [
    {
      title: "User Guide",
      items: [
        {
          label: "Overview",
          to: buildDocsRoute("", docsRoutePrefix),
        },
        {
          label: "Getting Started",
          to: buildDocsRoute("users/installation", docsRoutePrefix),
        },
      ],
    },
    {
      title: "Developer Guide",
      items: [
        {
          label: "Create Custom Responses",
          to: buildDocsRoute(
            "devs/custom-responses/getting-started",
            docsRoutePrefix
          ),
        },
        {
          label: "Contributing to DECSYS",
          to: buildDocsRoute("devs/contributing/source-code", docsRoutePrefix),
        },
        {
          label: "Platform Technical Reference",
          to: buildDocsRoute("devs/technical/architecture", docsRoutePrefix),
        },
      ],
    },
    {
      title: "Packages Reference",
      items: [
        {
          label: "Param Types",
          to: buildDocsRoute("pkg/param-types/overview", docsRoutePrefix),
        },
        {
          label: "Rating Scales",
          to: buildDocsRoute("pkg/rating-scales/overview", docsRoutePrefix),
        },
        {
          label: "Response Items",
          to: buildDocsRoute("pkg/response-items/overview", docsRoutePrefix),
        },
      ],
    },
    {
      title: "Information",
      items: [
        {
          label: "LUCID",
          href: "https://www.lucidresearch.org/decsys",
        },
        {
          label: "GitHub",
          href: "https://github.com/decsys/decsys",
        },
      ],
    },
  ],
  copyright: `Copyright © ${new Date().getFullYear()} DECSYS.`,
});

module.exports = {
  buildNavbarConfig,
  buildFooterConfig,
};
