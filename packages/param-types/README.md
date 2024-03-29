# Param Types

The DECSYS Parameter Types utilities package, used for authoring DECSYS Response Components.

# Installation

`npm install @decsys/param-types`

# Use in DECSYS Components

Component Authors should use `param-types` when writing components to provide their components with a `params` metadata property which provides a spec for parameters which should be configurable within the DECSYS Survey Platform.

It is possible to configure the `params` property without assistance from `param-types` but it's not recommended.

`param-types` provides helper functions and type constants to make specifying `params` easy.

1. Use the type builders `string`, `stringUndefined`, `number`, `bool` and `oneOf` to specify individual parameters easily

## Example

```javascript

import ParamTypes from "@decsys/param-types";

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
```

## Imports

You can import from `param-types` in a variety of ways.

It's only a small package but it should support tree shaking if you use named imports from specific modules.

```javascript
// named imports from specific modules
import { string as stringParam, oneOf } from "@decsys/param-types/builders";

// default imports from specific modules
// TODO: better example now `buildPropTypes` is gone
import buildPropTypes from "@decsys/param-types/buildPropTypes";

// default or named imports from the package
import paramTypes from "@decsys/param-types";
```

## ES Modules only?

`param-types` is only provided as untranspiled ES Modules.

It only depends on `prop-types` but that should be fulfilled as a peer dependency by the package using it (ultimately the Survey Platform).

DECSYS Components are expected to be written and exported as ES Modules (though bundled with their dependencies).

Due to the scope of use of `param-types`, other module formats, or direct browser use support do not seem necessary.

# Use in the DECSYS Survey Platform

The DECSYS Survey Platform contains some built-in components which all use `param-types` to specify their `params`.

The Platform's Component Editor uses the `param-types` type constants to avoid magic strings, and it uses the `params` specs of loaded components in order to provide a good parameter configuration experience in the UI.
