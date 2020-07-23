![GitHub](https://img.shields.io/github/license/decsys/param-types.svg)
[![Build Status](https://dev.azure.com/UniversityOfNottingham/DECSYS/_apis/build/status/decsys.param-types?branchName=master)](https://dev.azure.com/UniversityOfNottingham/DECSYS/_build/latest?definitionId=179&branchName=master)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@decsys/param-types/latest.svg)](https://www.npmjs.com/package/@decsys/param-types)

# Param Types

The DECSYS Parameter Types utilities package, used for authoring DECSYS Response Components.

# Installation

`npm install @decsys/param-types`

# Use in DECSYS Components

Component Authors should use `param-types` when writing components to provide their components with a `params` metadata property which provides a spec for parameters which should be configurable within the DECSYS Survey Platform.

It is possible to configure the `params` property without assistance from `param-types` but it's not recommended.

`param-types` provides helper functions and type constants to make specifying `params` easy.

It also provides a helper for generating `propTypes` and `defaultProps` for the parameter props as well.

1. Use the type builders `string`, `stringUndefined`, `number`, `bool` and `oneOf` to specify individual parameters easily
2. Use `buildPropTypes()` to build `propTypes` and `defaultProps` objects based on the above, as well as any additional `propTypes` and `defaultProps` passed to it.

## Example

```javascript

import ParamTypes, { buildPropTypes } from "@decsys/param-types";

/**
 * A component which has two configurable parameters,
 * and also props for loading previous results
 */
const MyComponent = ({ param1, param2, results }) => {
    //...
}

// Configure Component params using the type builders,
// so the Platform Editor knows how to configure your component
MyComponent.params = {
    param1: paramTypes.string("Friendly Label", "Default Value"),
    param2: paramTypes.oneOf(
        "Friendly Label",
        ["valid", "values", "not", "default"],
        "default")
}

// use `buildPropTypes()` to generate `propTypes` and `defaultProps`
// for the params, as well as those defined manually for other props
const { propTypes, defaultProps } = buildPropTypes(
    MyComponent.params,
    // propTypes
    {
        results: // ...
    },
    // defaultProps
    {
        results: // ...
    });

// Set `propTypes` and `defaultProps` on the Component
MyComponent.propTypes = propTypes;
MyComponent.defaultProps = defaultProps;
```

## Imports

You can import from `param-types` in a variety of ways.

It's only a small package but it should support tree shaking if you use named imports from specific modules.

```javascript
// named imports from specific modules
import { string as stringParam, oneOf } from "@decsys/param-types/builders";

// default imports from specific modules
import buildPropTypes from "@decsys/param-types/buildPropTypes";

// default or named imports from the package
import paramTypes, { buildPropTypes } from "@decsys/param-types";
```

## ES Modules only?

`param-types` is only provided as untranspiled ES Modules.

It only depends on `prop-types` but that should be fulfilled as a peer dependency by the package using it (ultimately the Survey Platform).

DECSYS Components are expected to be written and exported as ES Modules (though bundled with their dependencies).

Due to the scope of use of `param-types`, other module formats, or direct browser use support do not seem necessary.

# Use in the DECSYS Survey Platform

The DECSYS Survey Platform contains some built-in components which all use `param-types` to specify their `params`.

The Platform's Component Editor uses the `param-types` type constants to avoid magic strings, and it uses the `params` specs of loaded components in order to provide a good parameter configuration experience in the UI.

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
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
>
> This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
>
> You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
