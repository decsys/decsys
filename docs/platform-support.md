There are two aspects to the supported platforms for the Survey Platform:

- Supported platforms for **running** the application (as an **Admin**)
- Supported web browsers for **using** the application (as an **Admin** or a **Participant**)

## Running the application

!!! success "Tested and supported"

    - 64-bit Windows 10 Anniversary Update (version 1607) or newer.

??? "Should work"

    Realistically, you should be able to run the application anywhere [.NET Core 2.2 or newer is available](https://github.com/dotnet/core/blob/master/release-notes/2.2/2.2-supported-os.md).

    At minimum this includes:

    - Windows
        - 7 SP1 or newer
        - 8.1
        - 10 (1607) or newer
    - macOS 10.12 "Sierra" or newer
    - Linux - latest Ubuntu and Debian

## Using the application

!!! success "Tested and supported"

    - Microsoft Edge Classic (Windows 10 1607 or newer)
    - Google Chrome (last 2 versions)

??? info "Tested"

    - `// TODO`

??? "Should work"

    - Any "evergreen" web browser
        - Explicitly with support for directly loading ES Modules
            - `<script type="module">`

!!! danger "Unsupported"
  
 - Internet Explorer (any) - Any browser that doesn't support directly loading ES Modules - `<script type="module">`
