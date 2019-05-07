const pkg = require("./package.json");
const { BannerPlugin } = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = env => {
  const prod = ((env && env.NODE_ENV) || "production") === "production";
  return {
    mode: prod ? "production" : "development",
    entry: "./src/index.js",
    optimization: {
      usedExports: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react"
              ],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        }
      ]
    },
    devtool: prod ? "source-maps" : "inline-source-maps",
    resolve: {
      extensions: ["*", ".js", ".jsx"]
    },
    externals: {
      react: "React",
      "styled-components": "styled"
    },
    output: {
      path: `${__dirname}/dist`,
      filename: `${pkg.name.replace(/\//g, ".").replace(/@/g, "")}.js`,
      library: "DECSYS"
    },
    plugins: [
      new CleanPlugin(["dist"]),
      new BannerPlugin({
        banner: `${pkg.name} ${pkg.version} | ${new Date()}`,
        entryOnly: true
      })
    ]
  };
};
