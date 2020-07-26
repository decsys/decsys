# ✅ DECSYS Rating Scales

This package contains re-usable [React] Components used by the DECSYS project for native HTML/JS [Rating Scales].

You can use these basically anywhere you have [React].

The DECSYS Project uses them for survey question components for its Survey Platform.

# 🎉 Usage

## Installation

`npm install @decsys/rating-scales`

## ES Modules / CommonJS (Node)

The complete Scale components are accessible from the main package export.

Additionally, all the Scale components are default exports from individual modules, so can be referenced directly. This can enable tree shaking and smaller final bundles, so is recommended when in an environment that supports ES Modules.

### Importing a Scale component directly from its module

e.g. just the Discrete Scale

- esm: `import DiscreteScale from "@decsys/rating-scales/esm/discrete";`
- commonjs (node): `const DiscreteScale = require("@decsys/rating-scales/cjs/discrete");`

### Importing a Scale component from the main package export

e.g. all Scales

- esm: `import * as DECSYS from "@decsys/rating-scales";`
- commonjs (node): `const DECSYS = require("@decsys/rating-scales");`

e.g. for just the Discrete Scale

- esm: `import { DiscreteScale } from "@decsys/rating-scales";`
- commonjs (node): `const DiscreteScale = require("@decsys/rating-scales").DiscreteScale;`

## Browser

The components can be used directly in the browser.

You can access each Scale component under the namespace `DECSYS`.

The sub-components are not directly available in the browser.

## Scale Components

The following complete ratings scale components are available:

- Discrete Scale

  - esm: `import DiscreteScale from "@decsys/rating-scales/esm/discrete";`
  - commonjs (node): `const DiscreteScale = require("@decsys/rating-scales/cjs/discrete");`
  - browser (umd): `DECSYS.DiscreteScale`

- Ellipse Scale
  - esm: `import EllipseScale from "@decsys/rating-scales/esm/ellipse";`
  - commonjs (node): `const EllipseScale = require("@decsys/rating-scales/cjs/ellipse");`
  - browser (umd): `DECSYS.EllipseScale`

# 🏗 Building

At the top level of the repo:

- `npm i`
- `npm run rating-scales:build`

[react]: https://reactjs.org/
[rating scales]: https://en.wikipedia.org/wiki/Rating_scale
