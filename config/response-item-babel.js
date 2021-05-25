module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "supports es6-module-dynamic-import",
        modules: false,
        loose: true,
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        importSource: "@emotion/react",
      },
    ],
  ],
  plugins: ["@emotion/babel-plugin"],
};
