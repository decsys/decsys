# ✅ DECSYS Choose One Component

This is a component that allows a Survey Participant to select only one item from multiple choices.

# 🎉 Installation

- Acquire a distributable version:
  - Download a distributable version from Github Releases
  - Build from source (see below)
- Copy the `.js` file in into the Survey Platform's `components/` folder

# 🏗 Building

## Pre-requisites

- Node `10.x` or newer
  - comes with an appropriate version of npm

## Build steps

In the **root** of the repo:

- `npm i`
- `npm run choose-one:build`

The build outputs to the local `./dist` directory.

### Troubleshooting

More just a note: this package very carefully uses the depcrecated `rollup-plugin-commonjs` becuase its successor `@rollup/plugin-commonjs` does something (?) differently, and builds `react-input-autosize` wrong, resulting in a bundle that DECSYS can't run.

**Please don't upgrade `rollup-plugin-commonjs` for this package (until `react-input-autosize` is available as esm)!**
