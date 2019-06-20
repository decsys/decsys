![GitHub](https://img.shields.io/github/license/decsys/rating-scales.svg)
[![Build Status](https://dev.azure.com/UniversityOfNottingham/DECSYS/_apis/build/status/decsys.rating-scales?branchName=master)](https://dev.azure.com/UniversityOfNottingham/DECSYS/_build/latest?definitionId=162?branchName=master)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@decsys/rating-scales/latest.svg)](https://www.npmjs.com/package/@decsys/rating-scales)

# DECSYS Rating Scales

This package contains re-usable [React] Components used by the DECSYS project for native HTML/JS [Rating Scales].

You can use these basically anywhere you have [React].

The DECSYS Project uses them for survey question components for its Survey Platform.

# Usage

## Installation

`npm install @decsys/rating-scales`

## ES Modules / CommonJS (Node)

The complete Scale components are accessible from the main package export.

Additionally, all the Scale components are default exports from individual modules, so can be referenced directly. This can enable tree shaking and smaller final bundles, so is recommended when in an environment that supports ES Modules.

### Importing a Scale component directly from its module

e.g. just the Discrete Scale

- esm: `import DiscreteScale from "@decsys/rating-scales/esm/discrete";`
- commonjs (node): `const Frame = require("@decsys/rating-scales/cjs/discrete");`

### Importing a Scale component from the main package export

e.g. all Scales

- esm: `import * as DECSYS from "@decsys/rating-scales";`
- commonjs (node): `const DECSYS = require("@decsys/rating-scales");`

e.g. for just the Discrete Scale

- esm: `import { DiscreteScale } from "@decsys/rating-scales";`
- commonjs (node): `const DiscreteScale = require("@decsys/rating-scales").DiscreteScale;`

## Browser

The components can be used directly in the browser, as per the examples in `samples/`.

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

# Documentation

Full Component reference documentation can be built by running `npm run docs` in a clone of the repository.

# Building

The build workflow consists of several npm scripts.

There are a number of sub-tasks composed into higher-level tasks you're more likely to want to run:

- `npm run lint` will run eslint against the source.
- `npm run rollup` will build transpiled, minified bundles (with external source maps) for Browser, CommonJS and ES Modules.
- `npm run build` will lint and, if it passes, build the bundles as above. This is used in CI.
- `npm run watch [build]` will run `build` script described above and then watch for changes in the `src/` directory.

# Licensing

## Overview

This software is primarily licensed under the **GNU Affero General Public License v3.0 only** (`AGPL-3.0-only`).

A summary is provided below; the full license text may be found in `LICENSE.md`.

Other license arrangements may be made as appropriate on request.

## Copyright and License Summary

> DECSYS Param Types
>
> Copyright (C) 2019 Christian Wagner, LUCID (Lab for Uncertainty in Data and Decision Making)
>
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU Affero General Public License as published
> by the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.
>
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
> GNU Affero General Public License for more details.
>
> You should have received a copy of the GNU Affero General Public License
> along with this program. If not, see <https://www.gnu.org/licenses/>.

[react]: https://reactjs.org/
[rating scales]: https://en.wikipedia.org/wiki/Rating_scale
