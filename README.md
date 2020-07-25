# ✅ DECSYS

DECSYS is a tool that enables the creation and administration of digital surveys with support for conventional and custom responses.

# 📝 Documentation

- [Research Project Homepage](https://www.lucidresearch.org/decsys.html)
- [Usage and Technical Overview of the Application](https://decsys.github.io/decsys)
- [Custom Response Item Guide](https://github.com/decsys/component-boilerplate/wiki)

# 📦 Repository Contents

## Applications

| Location | Description |
| - | - |
| [`app/Decsys`](app/Decsys)         | The core DECSYS backend app.<br>An ASP.NET Core 3.1 API.                     |
| [`app/client-app`](app/client-app) | The core DECSYS frontend app.<br>A React app, hosted by the backend process. |

## Published Packages

| Location | Description |
| - | - |
| [`packages/param-types`](packages/param-types) | A utility package for specifying and handling Response Item parameters. |

## First Party Response Items

| Location | Description |
| - | - |
| [`response-items/confirmation`](response-items/confirmation) | The Confirmation Response Item that ships with DECSYS. |
| [`response-items/freetext`](response-items/freetext) | The Free Text Response Item that ships with DECSYS. |

## Other

| Location | Description |
| - | - |
| [`docs`](docs) | The documentation site.<br>Built by mkdocs. |

Most of the above Project Areas each have their own README with some details on getting started, and further details can be found in the Developer Guide.

# 🚝 Monorepo notes

This monorepo uses a possibly slightly unorthodox approach to managing some of its contents (at least compared to repos full of only javascript packages, such as Babel).

This is for three reasons:

- The repo contents are cross stack (Dotnet, JS, python...)
- We have a Create-React-App application (`app/client-app`)
- We have javascript packages that are both depended on elsewhere in the repo, *and* published to public registries.

The result of all of this is as follows:

- Non Javascript projects are managed local to themselves, as normal.
  - Really this is because they aren't interdependent.
  - But regardless, work with them as you normally would: from their own project roots.
  - The semi-exception to this is the Visual Studio Solution file in the root of the repo.
- All javascript in `packages/` or `response-items/` use Lerna, npm, and the npm `file:` protocol for local dependencies.
  - Don't use `lerna bootstrap`; this is a `lerna link convert` repo.
  - Shared dev dependencies are in the top level `package.json`
  - `npm install` at the top level; `npm run` top level scripts only.
  - There are no project local `node_modules`.
- The CRA app (`appp/client-app`) is sort of a hybrid.
  - It isn't a Lerna package.
  - `npm install` locally - gives a local `node_modules` directory.
  - `npm run` local scripts. This is necessary so `react-scripts` works properly.
  - However, it still uses the top-level shared dependencies, to ensure version consistency in the repo.
    - so `devDependencies` can be either in the local `package.json` or the top-level one, depending if they're shared.
    - This works due to node module resolution, without worrying about Lerna.
    - technically, all `dependencies` are `devDependencies` because it's a built app not a package.
    - therefore its ok to hoist `dependencies` like `@chakra-ui/core` to the top-level `devDependencies`.
  - This app isn't a published package, so we don't have to resolve the `file:` links; we only distribute the built version.

# ⚖ Licensing

## Overview

This software is primarily licensed under the **GNU Affero General Public License v3.0 only** (`AGPL-3.0-only`).

A summary is provided below; the full license text may be found in [`LICENSE.md`](LICENSE.md).

Other license arrangements may be made as appropriate on request.

## Copyright and License Summary

    DECSYS

    Copyright (C) 2019 Christian Wagner, LUCID (Lab for Uncertainty in Data and Decision Making)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.
