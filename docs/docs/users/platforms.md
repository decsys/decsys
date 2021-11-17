---
title: Supported Platforms
---

There are two aspects to the supported platforms for the Survey Platform:

- Supported platforms for **running** DECSYS
    - In **Workshop** mode this means your computer, as the **Admin**.
    - In **Hosted** mode this means the computer you are hosting it on.
- Supported web browsers for **using** the application (as either an **Admin** or a **Participant**)

## Running the application

:::success Tested and Supported
- 64-bit Windows 10 Anniversary Update (1607) or newer
:::

### Expected to work
:::info
Realistically, you should be able to run DECSYS anywhere [.NET 6.0 or newer is available](https://github.com/dotnet/core/blob/main/release-notes/6.0/supported-os.md).
:::

| Operating System | Versions | Notes |
|-|-|-|
| Windows | `7 SP1` `8.1` `10 (1607) or newer` | |
| macOS | `10.14` (Mojave) or newer | |
| Linux | latest Ubuntu and Debian | Many more distros are supported by .NET |

## Using the application

Because the Platform is a web app, platform support is based on web browser rather than operating system.

:::info Smartphone / Tablet support
- The **Admin** user interface is only designed for use on Desktop Computers.
- The **Participant** user interface should work on smartphones and tablets but is not officially supported.
:::

:::success Tested and supported
- **Google Chrome** (last 2 versions) - Windows, macOS, Linux
:::

:::info Expected to work
- Any "evergreen" web browser that supports `<script type="module">`
:::

:::warning Unsupported
- Internet Explorer (any)
- Any browser that doesn't support `<script type="module">`
:::
