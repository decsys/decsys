module.exports = {
  stories: ["../src/stories/**/*.stories.@(mdx|js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },

  viteFinal: (config) => {
    // TODO ts config paths?
    config.resolve.alias = [
      // {
      //   find: "~",
      //   replacement: path.resolve(__dirname, "../../app/client-app/src/*"),
      // },
      // {
      //   find: "#client-app",
      //   replacement: path.resolve(__dirname, "../../app/client-app/src/*"),
      // },
      // {
      //   find: "#response-items",
      //   replacement: path.resolve(__dirname, "../../response-items/src/*"),
      // },
      // {
      //   find: "#rating-scales",
      //   replacement: path.resolve(
      //     __dirname,
      //     "../../packages/rating-scales/src/*"
      //   ),
      // },
    ];

    return config;
  },
};
