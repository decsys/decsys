# ✅ DECSYS Choose One Response

This is a component that allows a Survey Participant to select only one item from multiple choices.

# 📝 Documentation

For usage and reference refer to the DECSYS Documentation.

# 📜 Scripts

## 🚝 Read the monorepo notes in the repository root!

| command | notes |
|-|-|
| `yarn storybook` | Run Storybook for testing |
| `yarn build` | Build the DECSYS Response Item.<br>Output to `./dist/` |

# ⚠ Troubleshooting

More just a note: this package very carefully uses the deprecated `rollup-plugin-commonjs` because its successor `@rollup/plugin-commonjs` does something (?) differently, and builds `react-input-autosize` wrong, resulting in a bundle that DECSYS can't run.

**Please don't upgrade `rollup-plugin-commonjs` for this package (until `react-input-autosize` is available as esm)!**
