# ✅ DECSYS Rating Scales

This package contains re-usable [React] Components used by the DECSYS project for native HTML/JS [Rating Scales].

You can use these basically anywhere you have [React].

The DECSYS Project uses them for survey question components for its Survey Platform.

# Types of Rating Scale

This library contains React implementations of a number of rating scales. The implementations are as equivalent as possible to allow for unbiased comparison between rating approaches.

## Likert / Discrete Scale

This is a typical  "On a scale of 1 - 5" type rating.

There are discrete values on the scale that can be selected as the value of response.

They are implemented as radio buttons spaced equally on a horizontal scale.

## Ellipse Scale

This is a software implmentation of the ["Interval Agreement Approach scale"](https://ieeexplore.ieee.org/document/6762925).

There is a continuous horizontal scale between two values, and a drawn ellipse (by mouse or touch input) is used to provide lower and upper bounds of the response within the range of the scale.

The width of the ellipse (distance between the bounds) can be considered a measure of the confidence of the response.

## Visual Analog Scale

This is like a typical "Slider" UI component, in that it allows selection of a single point on a continuous scale.

There is a continuous horizontal scale between two values, and a draggable marker (by mouse or touch input) is placed at the desired point on the scale to give a response.

## Multi Visual Analog Scale

This implementation is similar to the Visual Analog Scale above, but provides multiple distinct values on the same continuous scale, to represent different aspects of the response.

By using multiple draggable markers on the same scale, a lower bound and upper bound value can be provided, as well as a "best estimate" for the actual value.

Finally, a confidence percentage value is also provided.

This scale can be considered to provide most of the same information as the Ellipse Scale - upper and lower bounds and specified by their own markers, and the confidence is provided as a percentage rather than simply the distance between the bounds.

Beyond the Ellipse, it also has the "best estimate" value, which would be like weighting the range covered by the bounds towards a point contained within them, and the confidence indicates how close to that estimate the true value is likely to be.

Of course, a confidence of 100% should see both bounds and the best estimate all located on the same value.

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
