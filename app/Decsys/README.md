# ✅ DECSYS Survey Platform

The DECSYS Survey Platform aims to be a flexible cross-platform web-based survey platform that particularly makes it easy to load custom question response components.

It is used to showcase the DECSYS Ellipse Rating Scale.

For usage guidance, please refer to the Documentation.

## Running as a service

When hosting Decsys on a remote server, you may want to install it as a service, if you don't put it behind a reverse proxy.

For Windows, we recommend using [NSSM](https://nssm.cc/) to do so.

### ⚠ Troubleshooting

- Mostly just ensure nothing else is bound to port `80` on your network interfaces.
  - Or edit the launch script to change the port / specify a port when using the `dotnet` CLI

# 🏗 Building the Survey Platform

## Prerequisites

- `dotnet` SDK `3.1` or newer
  - either independently or part of Visual Studio 2019 or newer
- node.js `10.x` or newer (including `npm`)

## Build steps

1. Optionally get some [Response Components](https://github.com/search?q=org%3Adecsys+component+in%3Aname+archived%3Afalse) and put them in `app/Decsys/components/`
1. For development:

   - In Visual Studio:
      1. Open `Decsys.sln`
      1. Build / Run
   - on the command line:
      1. Install top level javascript dependencies
         - `yarn`
      1. Build the application
         - `dotnet build` **in `app/Decsys`**

1. For publishing:
   1. Complete the development steps above
   1. On the command line:
      1. `yarn build` **in `app/client-app`**
      1. Copy `app/client-app/build/*` to `app/Decsys/ClientApp`
      1. `dotnet publish -c release` **in `app/Decsys`**
    1. The publish output can be distributed
        - optionally with supporting bootstrap scripts from `app/scripts`.
