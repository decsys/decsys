[![Build Status](https://travis-ci.org/decsys/rating-scales.svg?branch=master)](https://travis-ci.org/decsys/rating-scales)

# DECSYS Rating Scales

This package contains re-usable [React] Components used by the DECSYS project for native HTML/JS [Rating Scales].

You can use these basically anywhere you have [React].

The DECSYS Project uses them for survey question components for its Survey Platform.

# Usage

## Installation

`npm install @decsys/rating-scales`

## Node

The complete Scale components are accessible from the main package export.

Additionally, all the components are default exports from individual modules, so can be referenced directly.

### Importing a Scale component from the main package export

e.g. all Scales

- `import * as DECSYS from "@decsys/rating-scales";`
- `const DECSYS = require("@decsys/rating-scales");`

e.g. for just the Likert Scale

- `import { LikertScale } from "@decsys/rating-scales";`
- `const LikertScale = require("@decsys/rating-scales").LikertScale;`

### Importing a sub-component directly from its module

e.g. the basic `Frame` component

- `import Frame from "@decsys/rating-scales/core/Frame";`
- `const Frame = require("@decsys/rating-scales/core/Frame");`

## Browser

The components can be used directly in the browser, as per the examples in `samples/`.

You can access each Scale component under the namespace `DECSYS`.

The sub-components are not directly available in the browser.

## Scale Components

The following complete ratings scale components are available:

- Likert Scale

  - `import { LikertScale } from "@decsys/rating-scales";`
  - `const LikertScale = require("@decsys/rating-scales").LikertScale;`
  - `DECSYS.LikertScale` when using the browser build.

- Ellipse Scale
  - `import { EllipseScale } from "@decsys/rating-scales";`
  - `const EllipseScale = require("@decsys/rating-scales").EllipseScale;`
  - `DECSYS.EllipseScale` when using the browser build.

# Documentation

Full Component reference documentation can be built by running `npm run docs` in a clone of the repository.

# Building

The build workflow consists of several npm scripts.

There are a number of sub-tasks composed into higher-level tasks you're more likely to want to run:

- `npm run lint` will run eslint against the source.
- `npm run rollup` will build transpiled, minified bundles (with external source maps) for Browser, CommonJS and ES Modules.
- `npm run build` will lint and, if it passes, clear the `dist/` directory and build the bundles as above. This is used in CI.
- `npm run watch [build]` will run `build` script described above and then watch for changes in the `src/` directory.

# Licensing

At this time, this software has no license, and therefore all rights are reserved as per author copyright, with the exception of rights waived under the GitHub Terms of Service.

Please don't modify, distribute or use this software until a license is in place.

[react]: https://reactjs.org/
[rating scales]: https://en.wikipedia.org/wiki/Rating_scale
