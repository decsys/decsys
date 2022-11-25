# Samples

This project is used for interactively showcasing and testing elements from everywhere in the repo.

This is done in two ways: the Sample App, and Storybook.

## Sample App

The project is a standard Vite project, and so can run/build an app that can be used to showcase anything in the repo as desired.

## Storybook

Storybook is added against the sample app, in order to simplify configuration (it's already inside the context of a Vite React app).

This should be treated as a single repo-wide top level Storybook instance.

In future, multiple configurations may be considered, but currently it loads all stories centrally from within this project, at `/src/stories/`.

It uses the Vite builder for Storybook.

## Paths

This project references code from elsewhere in the repo directly by TypeScript Paths config, rather than relying on package exports, as would be more typical.

This simplifies sampling code from projects which may not be configured to provide a clear public interface (e.g. a client app SPA).

As such, there are path aliases defined to reference any relevant project in the form `#<unscoped-package-name>`.

e.g.

- `#client-app/*` for files in the `client-app` `src/` directory.
- `#rating-scales/*` for files in the `@decsys/rating-scales` `src/` directory

### Gotchas

- If the source inside a package uses a path configuration, storybook/ts will need to be aware of that too, e.g. `~` used to point to a project root.
  - Bear in mind these can't conflict, so ideally projects should use unique aliases (perhaps matching the `#package` form, or relative references only).
- Currently Paths are double configured in `tsconfig.json` for Vite, and `viteFinal` config for Storybook. In future, Storybook might inherit from `tsconfig.json` too
