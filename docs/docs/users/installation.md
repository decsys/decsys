---
title: Installation
---

There are two ways to use DECSYS: **Workshop** mode, and **Hosted** mode.

In **Workshop** mode, you can simply run DECSYS on your computer, and have participants connect to it over a local network. All data is stored locally on your computer.

In **Hosted** mode, DECSYS is hosted on the internet, and requires some additional configuration to allow the use of user accounts and storing the data in a remote database.

## Workshop mode setup

### 64-bit Windows 7 or newer

1. Download a `win-x64` asset from **Releases**
1. Extract it to a folder
1. Double-click `Run Decsys`
1. Open a web browser and navigate to `localhost`

### For other Operating Systems

#### Prerequisites

- .NET 5.0 or newer Runtime.

#### Setup Steps
  1. Download a `dotnet-5.0` asset from **Releases**
  1. Extract it to a folder
  1. Run the application as follows:
     - Use the provided `run-decsys` or `Run Decsys (Windows)` script
     - Use the `dotnet` CLI
       - Navigate inside the `Decsys/` folder
       - run `dotnet decsys.dll`
       - Optionally pass server urls argument to specify a port, otherwise `5000` will be used.
         - e.g. `dotnet decsys.dll --server.urls http://0.0.0.0:80`
  1. Open a web browser and navigate to `localhost`

## Hosted mode setup

### Prerequisites

:::info 🚧 Under construction
This section is under construction and may change.
:::

By 2.0, Hosted DECSYS will require a mongodb server to connect to.

### Setup Steps
First follow the Workshop mode steps, to get a copy of DECSYS running on the host machine.

Then, you'll need to make some configuration changes:

- Set `WorkshopMode` to `false`
- Set `Hosted:Origin` to the scheme, hostname/ip and port that DECSYS will be bound on
  - e.g. `https://my-decsys-server.com:5001`
- Set `Hosted:AdminPassword` to the password for your admin user.
- Set `Hosted:JwtSigningKey` to a [JSON Web Key](https://mkjwk.org)

:::info ✏ //TODO
More JWK details
:::
