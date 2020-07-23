# DECSYS

This is the main repository for DECSYS; a configurable Survey Platform that makes it easy to provide custom responses via a plugin system.

This repository contains:

- The DECSYS Survey Platform application.
  - a .NET Core 3.1 backend web application.
  - a Create React App client application, hosted by the backend app.
- Packages used by the overall project, and designed to be useful to other developers.
  - `param-types` is a utility library used by the platform and any Page Items.
  - `rating-scales` is a set of React Components for a variety of rating scales, that can be used anywhere React is.
  - `iaa` is a set of implementations for applying the type-1 Interval Agreement Approach, which is used by DECSYS' Ellipse Rating Scale.
- First party Page Response Items that ship with releases of the app.
  - `FreeText`
  - `Confirmation`
  - `Discrete Scale`
  - `Ellipse Scale`
  - `Choose one`
- Documentation for using, working with and developing for DECSYS.
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
