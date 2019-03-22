# DECSYS Components

This is a very simple DECSYS Component, it also contains information on developing your own, at the moment. This will move to a formal boilerplate repo soon.

# How do I use it

- (TODO: Download a distributable version from Releases or npm)
- Build from source:
  - `npm i`
  - `npm run build`
- Copy the `.js` file in `dist/` into the Survey Platform's components folder

# How do DECSYS Components work?

DECSYS Components are just React Components + metadata. There are two important things about preparing a component for loading into the DECSYS Survey Platform:

1. The Component Module must provide the correct exports
2. The module must be bundled correctly into a single self contained file for the Survey Platform to dynamically load

## 1. Metadata and Exports

The Component entrypoint **must** export:

- a React Component as a default export, e.g. `export default FreeText`
- `name`: The name of the Component, e.g. `FreeText`

The React Component **must** also feature the following metadata properties:

- `propTypes` and `defaultProps` as usual React Prop Types
- `icon`: An SVG icon for the component (e.g. a component from `styled-icons`) which will be rendered at `1em` to represent the component type

In this repo we use the bundling process to provide the correct exports in the final bundle, so the source entrypoint (`src/index.js`) doesn't export exactly as above.

## 2. Bundling

This repo contains the appropriate dependencies and configuration for bundling a DECSYS Component correctly.

Make sure:

- The React component is named, as the bundling process uses the component's name as the `name` export.
- The React component has the required metadata properties.
- `package.json` contains necessary information:
  - `bundle` should be set to the filename, without extension, you want to use for the single file bundle output.

For more detail on the bundling requirements and how this repo meets them, read on.

### Requirements

The bundle process needs to obey the following rules:

- Transpile JSX and modern features to run in DECSYS supported browsers
  - leave ES Modules intact
- Treat the following npm packages as globals (as the Survey Platform provides a single instance of them for component use):
  - React
  - ReactDOM
  - Styled Components
- Bundle into a single file including npm dependencies (except the globals)
- The final file must export as per the rules in `1. Exports` above

### How this repo does it

- Rollup runs the source through Babel, leaving ES Modules intact
- Rollup walks the ESM dependencies, including npm packages
  - Rollup tree shakes wherever it can :)
- Rollup replaces the appropriate globals
- Rollup produces an IIFE bundle in a single file.
- The build script `build/esm-export.js` changes the IIFE to a locally scoped variable, instead of a global
- The build script `build/esm-export.js` adds ESM exports to export the relevant bits of the IIFE module.

# Licensing

At this time, this software has no license, and therefore all rights are reserved as per author copyright, with the exception of rights waived under the GitHub Terms of Service.

Please don't modify, distribute or use this software until a license is in place.
