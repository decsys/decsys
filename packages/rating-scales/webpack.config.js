const pkg = require("./package.json");
const banner = require("webpack").BannerPlugin;

module.exports = env => {
  const prod = ((env && env.NODE_ENV) || "production") === "production";
  return {
    mode: prod ? "production" : "development",
    entry: "./src/index.js",
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
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
      new banner({
        banner: `${pkg.name} ${pkg.version} | ${new Date()}`,
        entryOnly: true
      })
    ]
  };
};
