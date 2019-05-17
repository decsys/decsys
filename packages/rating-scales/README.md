[![NPM](https://nodeico.herokuapp.com/@decsys/rating-scales.svg)](https://npmjs.com/package/@decsys/rating-scales)

![GitHub](https://img.shields.io/github/license/decsys/rating-scales.svg)
[![Build Status](https://dev.azure.com/UniversityOfNottingham/DECSYS/_apis/build/status/decsys.rating-scales?branchName=master)](https://dev.azure.com/UniversityOfNottingham/DECSYS/_build/latest?definitionId=162?branchName=master)

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

This software is primarily licensed under the **GNU Affero General Public License v3.0 only** (`AGPL-3.0-only`)

    DECSYS Rating Scales
    Copyright (C) 2019

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Other license arrangements may be made as appropriate on request.

[react]: https://reactjs.org/
[rating scales]: https://en.wikipedia.org/wiki/Rating_scale
