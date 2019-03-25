import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";
import builtin from "rollup-plugin-node-builtins";

const pkg = require("./package.json");

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "DecsysComponent",
    file: `dist/${pkg.bundle}.js`,
    exports: "named", // explicitly set default export as a `<name>.default` named export
    globals: {
      react: "React",
      "styled-components": "styled",
      "react-dom": "ReactDOM",
      "prop-types": "PropTypes"
    }
  },
  external: ["react", "styled-components", "react-dom", "prop-types"],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: ">0.2%, not dead, not ie <= 11, not op_mini all",
            modules: false
          }
        ],
        "@babel/preset-react"
      ]
    }),
    resolve({ preferBuiltins: false }),
    cjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        "node_modules/resource-loader/lib/index.js": ["Resource"]
      }
    })
    //builtin()
  ]
};
