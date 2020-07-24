# DECSYS

This is the main repository for DECSYS; a configurable Survey Platform that makes it easy to provide custom responses via a plugin system.

# Getting Started

To use DECSYS, you can download a release from GitHub Releases. For more information see the [Application README](app/README.md).

To build or develop, there are some prerequisites taht are required depending on what area of the codebase you are working with.

Each area's own README gives details on working with them, but as a starting point, please consider the following:

- The main application is a .NET Core 3.1 Web Application
  - so you'll want the latest .NET Core SDK 3.1 at a minimum
- All the javascript bits of the repo are dependency managed using **Yarn workspaces**.
  - You need node `10.x` or newer.
    - That'll come with an appropriate version of `npm`.
  - You need Yarn globally installed. The recommended way today is from npm: `npm i -g yarn`
    - The global tool will then use the local repo copy of yarn.
  - Run `yarn` at any level to install dependencies.
  - notes:
    - Shared `devDependencies` are at the workspace top level.
    - Specific `devDependencies` and direct `dependencies` are stored locally to each workspace (everywhere there's a `package.json`)
    - the repo also has `lerna` to ease managing direct `dependencies` in many packages at once.
  - use `yarn` to run scripts, e.g. `yarn build`
- The docs are written in Markdown and built by `mkdocs`
  - so you may want a local mkdocs installation to preview your changes.
  - mkdocs needs Python 3.x

# Repository Contents Overview
This repository contains:

- The DECSYS Survey Platform application.
  - a .NET Core 3.1 backend web application. (`app/Decsys`)
  - a Create React App client application, hosted by the backend app. (`app/client-app`)
- Packages used by the overall project, and designed to be useful to other developers. (inside `packages/`)
  - `param-types` is a utility library used by the platform and any Page Items.
  - `rating-scales` is a set of React Components for a variety of rating scales, that can be used anywhere React is.
  - `iaa` is a set of implementations for applying the type-1 Interval Agreement Approach, which is used by DECSYS' Ellipse Rating Scale.
- First party Page Response Items that ship with releases of the app. (inside `response-items/`)
  - `FreeText`
  - `Confirmation`
  - `Discrete Scale`
  - `Ellipse Scale`
  - `Choose one`
- Documentation for using, working with and developing for DECSYS. (inside `docs/`)
  - This is also published to GitHub Pages.
  - It also ships with every release of the Survey Platform.

These various areas have their own READMEs with details on working with them.

# Licensing

## Overview

This software is primarily licensed under the **GNU Affero General Public License v3.0 only** (`AGPL-3.0-only`).

A summary is provided below; the full license text may be found in `LICENSE.md`.

Other license arrangements may be made as appropriate on request.

## Copyright and License Summary

> DECSYS
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
