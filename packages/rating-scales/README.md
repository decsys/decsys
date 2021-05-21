# ✅ DECSYS Rating Scales

This package contains re-usable [React] Components used by the DECSYS project for native HTML/JS [Rating Scales].

You can use these basically anywhere you have [React].

The DECSYS Project uses them for survey question components for its Survey Platform.

# 📦 Package Format

Currently this package is expected to be used in a Node environment (probably a bundler like webpack) that supports ES Modules.

This is mainly due to package dependencies making Browser ESM support complex. A simple browser module is under consideration, but CommonJS support will never happen art this point.

The ES Modules are untranspiled, and expect to be transpiled (and optionally bundled) downstream by the consumer.

Obviously due to containing React components, the consuming environment must handle JSX.

# 🎉 Usage

## Installation

`npm install @decsys/rating-scales @emotion/react @emotion/css`

- `@emotion/react` and `@emotion/css` are peer dependencies
  - this reduces bundle size and is preferable or environments where emotion is already in use

## ES Modules (Node)

All the Scale components are accessible from the main package export.

Additionally, all the Scale components are named exports from individual modules, so can be referenced directly.

### Importing a Scale component directly from its module

e.g. just the Discrete Scale

- esm: `import { DiscreteScale } from "@decsys/rating-scales/discrete";`

### Importing a Scale component from the main package export

e.g. all Scales (not recommended)

- esm: `import * as DECSYS from "@decsys/rating-scales";`

e.g. just the Discrete Scale

- esm: `import { DiscreteScale } from "@decsys/rating-scales";`

# 📜 Scripts

## 🚝 Read the monorepo notes in the repository root!

| command          | notes                                                           |
| ---------------- | --------------------------------------------------------------- |
| `yarn storybook` | Run Storybook for testing                                       |
| `yarn build`     | Builds the CommonJS distributable undle.<br>Output to `./dist/` |

[react]: https://reactjs.org/
[rating scales]: https://en.wikipedia.org/wiki/Rating_scale
