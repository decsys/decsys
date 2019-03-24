# param-types

The Parameter Types utilities package for DECSYS Components

# Installation

`npm install param-types`

# Use in DECSYS Components

Component Authors should use `param-types` when writing components to provide their components with a `params` metadata property which provides a spec for parameters which should be configurable within the DECSYS Survey Platform.

It is possible to configure the `params` property without assistance from `param-types` but it's not recommended.

`param-types` provides helper functions and type constants to make specifying `params` easy. It also sets `propTypes` and `defaultProps` for the parameter props at the same time.

1. Use the type builders `string`, `stringUndefined`, `number`, `bool` and `oneOf` to specfy individual parameters easily
2. Use `setParams` to build a `params` spec on the component from the above, and also set `propTypes` and `defaultProps`.

## Example

```javascript

import paramTypes, { setParams } from "param-types";

/**
 * A component which has two configurable parameters,
 * and also props for loading previous results
 */
const MyComponent = ({ param1, param2, results }) => {
    //...
}

// Still configure propTypes for props which aren't configurable parameters
MyComponent.propTypes = {
    results: // ...
};
MyComponent.defaultProps = {
    results: // ...
};

// Use setParams for specifying data about configurable parameters, so the Platform Editor knows how to configure your component
setParams(MyComponent, {
    param1: paramTypes.string("Friendly Label", "Default Value"),
    param2: paramTypes.oneOf(
        "Friendly Label",
        ["valid", "values", "not", "default"],
        "default")
});

```

## Imports

You can import from `param-types` in a variety of ways.

It's only a small package but it should support tree shaking if you use named imports from specific modules.

```javascript
// named imports from specific modules
import { string as stringParam, oneOf } from "param-types/builders";

// default imports from specific modules
import setParams from "param-types/setParams";

// default or named imports from the package
import paramTypes, { setParams } from "param-types";
```

## ES Modules only?

`param-types` is only provided as ES Modules.

It only depends on `prop-types` but that should be fulfilled as a peer dependency by the package using it (ultimately the Survey Platform).

DECSYS Components are expected to be written and exported as ES Modules (though bundled with their dependencies).

Due to the scope of use of `param-types`, other module formats, or direct browser use support do not seem necessay.

# Use in the DECSYS Survey Platform

The DECSYS Survey Platform contains some built-in components which all use `param-types` to specify their `params`.

The Platform's Component Editor uses the `param-types` type constants to avoid magic strings, and it uses the `params` specs of loaded components in order to provide a good parameter configuration experience in the UI.

# Licensing

At this time, this software has no license, and therefore all rights are reserved as per author copyright, with the exception of rights waived under the GitHub Terms of Service.

Please don't modify, distribute or use this software until a license is in place.