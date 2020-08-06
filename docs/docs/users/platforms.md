---
title: Supported Platforms
---

There are two aspects to the supported platforms for the Survey Platform:

- Supported platforms for **running** the application (as an **Admin**)
- Supported web browsers for **using** the application (as an **Admin** or a **Participant**)

## Running the application

!!! success "Tested and supported"
    - 64-bit Windows 10 Anniversary Update (1607) or newer.

??? info "Should work"
    Realistically, you should be able to run the application anywhere [.NET Core 3.1 or newer is available](https://github.com/dotnet/core/blob/master/release-notes/3.1/3.1-supported-os.md).

    At minimum this includes:

    - Windows
        - 7 (SP1 or newer)
        - 8.1
        - 10 (1607 or newer)
    - macOS 10.12 "Sierra" or newer
    - Linux - latest Ubuntu and Debian

## Using the application

Because the Platform is a web app, platform support is based on web browser rather than operating system.

!!! warning "The **Admin** user interface is only designed for use on Desktop Computers."
!!! warning "The **Participant** user interface should work on smartphones but is not officially supported."

!!! success "Tested and supported"
    - **Microsoft Edge Classic** - Windows 10 (1607 or newer)
    - **Google Chrome** (last 2 versions) - Windows, macOS, Linux

??? info "Should work"
    - Any "evergreen" web browser
        - Explicitly with support for directly loading ES Modules
            - `<script type="module">`

!!! danger "Unsupported"
    - Internet Explorer (any)
    - Any browser that doesn't support directly loading ES Modules
        - `<script type="module">`

### Browser Test Results

| OS | Edge Classic | Chrome | Firefox | Safari | Samsung Internet |
|-|-|-|-|-|-|
| Windows 10 | ✔ | ✔ | ✔ | - | - |
| Windows 7 | - | ✔ | ✔ | - | - |
| macOS 10 | - | ✔ | not tested | ✔ | - |
| Android 7 | ⚠ no Ellipse touch support | ✔ | ✔ | - | ✔ |
| iOS 12 | ⚠ no Ellipse touch support | ✔ | ✔ | ✔ | - |
