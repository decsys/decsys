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

1. The Component module must export certain metadata, as well as its React Component
2. The module must be bundled correctly into a single file for the Survey Platform to dynamically load

## 1. Exports

The Component entrypoint (`src/index.js` in this repository) must export the following:

- The React Component as a default export, e.g. `export default FreeText` in this repo
    - The React Component **MUST** have `propTypes` and `defaultProps`
- Named exports of the following metadata:
  - `name`: The name of the Component, e.g. `FreeText` in this repo

## 2. Bundling

This repo contains the appropriate dependencies and configuration for bundling a DECSYS Component correctly.

All you need to do is ensure `package.json` contains the right information:

- `bundle` should be set to the filename, without extension, you want to use for the single file bundle output.

If you are interested in the bundling process, below are detailed the rules for creating a bundle the Survey Platform will load, and a decscription of how this repo meets those requirements.

### Rules

The bundle process needs to obey the following rules:

- (TODO: Transpile JSX and modern features to run in DECSYS supported browsers)
  - leave ES Modules intact
- Treat the following npm packages as globals (as the Survey Platform provides a single instance of them for component use):
  - React
  - PropTypes
  - Styled Components
- Bundle into a single file including npm dependencies (except the globals)
- The final file must export as per the rules in `1. Exports` above

### How this repo does it

- (TODO: Rollup runs the source through Babel, leaving ES Modules intact)
- Rollup walks the ESM dependencies, including npm packages
  - Rollup tree shakes wherever it can :)
- Rollup replaces the appropriate globals
- Rollup produces an IIFE bundle in a single file.
- The build script `build/esm-export.js` changes the IIFE to a locally scoped variable, instead of a global
- The build script `build/esm-export.js` adds ESM exports to export the relevant bits of the IIFE module.

# Licensing

At this time, this software has no license, and therefore all rights are reserved as per author copyright, with the exception of rights waived under the GitHub Terms of Service.

Please don't modify, distribute or use this software until a license is in place.