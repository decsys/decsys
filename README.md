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
| [`app/Decsys`](app/Decsys)         | The core DECSYS backend app.<br>An ASP.NET Core 5.0 API.                     |
| [`app/client-app`](app/client-app) | The core DECSYS frontend app.<br>A React app, hosted by the backend process. |

## Published Packages

| Location | Description |
| - | - |
| [`packages/param-types`](packages/param-types) | A utility package for specifying and handling Response Item parameters. |
| [`packages/rating-scales`](packages/rating-scales) | Reusable React Components for Rating Scales:<br>- Ellipse Scale<br>- Discrete Scale |

## First Party Response Items

| Location | Description |
| - | - |
| [`response-items/choose-one`](response-items/choose-one) | The Choose One Response Item that ships with DECSYS. |
| [`response-items/confirmation`](response-items/confirmation) | The Confirmation Response Item that ships with DECSYS. |
| [`response-items/discrete-scale`](response-items/discrete-scale) | The Discrete Scale Response Item that ships with DECSYS. |
| [`response-items/ellipse-scale`](response-items/ellipse-scale) | The Ellipse Scale Response Item that ships with DECSYS. |
| [`response-items/freetext`](response-items/freetext) | The Free Text Response Item that ships with DECSYS. |


## Other

| Location | Description |
| - | - |
| [`docs`](docs) | The documentation site.<br>🏗 Built by [Docusaurus](https://v2.docusaurus.io/). |

Most of the above Project Areas each have their own README with some details on getting started, and further details can be found in the Developer Guide.

# 🚝 Monorepo notes

This monorepo uses Yarn 2 Workspaces for managing dependencies / running scripts across several javascript projects.

This means the following:
- Non javascript projects are managed as normal, relative to their project directories.
- The .NET app is a slight exception to the above
  - Because it hosts a javascript project (`client-app`), its debug build process has similar environment expectations to `client-app`
  - `DECSYS.sln` is actually in the root of the repo, not the project directory.
- Javascript projects have some environment prerequisites.

## Prerequisites for Javascript projects

- Have node.js (`10.x` or newer, so it comes with `npm`)
- Have yarn globally installed.
  - the recommended way today is to install from npm:
    - `npm i -g yarn`
  - this global installation will then use the repo's local version in `.yarn/releases`

## Yarn 2 / Workspaces notes

Some notes on our usage of Yarn 2 in this repo:

- We use **Plug n' Play** mode.
  - no `node_modules` folders.
  - better dependency integrity
  - stricter dependency rules
    - this can have side effects that may require temporary workarounds
- We use **Workspaces**
  - packages installed and cached at the top level of the repo, not per project
  - one `yarn.lock` for the whole repo
  - many `package.json` manifests - one per project.
  - one `.yarnrc.yml` config file for the repo.
  - `yarn` cli commands can be run against a workspace as follows:
    - `yarn workspace <package_name> <command>`
    - e.g. `yarn workspace @decsys/client-app add some-package`
  - scripts can be run against a workspace as above
    - `yarn workspace <package_name> <script_name>`
    - e.g. `yarn workspace @decsys/client-app build`
  - scripts can be run relative to a project directory
    - e.g. `/app/client-app> yarn build`
  - many `yarn` commands are workspace-wide:
    - e.g. `yarn up my-package@latest` will upgrade `my-package` in any package that depends on it.

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
