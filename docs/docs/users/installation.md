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

:::info 🚧 Under construction
This section is under construction and may change.
:::


:::tip 🙋🏾‍♀️ Default Hosted mode Admin Username
`@admin`
:::

### Prerequisites

- A MongoDB Server (`4.x` or newer)

### Setup Steps
First follow the Workshop mode steps, to get a copy of DECSYS running on the host machine.

Then, you'll need to make some configuration changes as follows:

- Set `ConnectionStrings:mongo` to your MongoDB Server's connection string.
- Set `WorkshopMode` to `false`
- Set `Hosted:Origin` to the scheme, hostname/ip and optionally port that DECSYS will be bound on
  - e.g. `https://my-decsys-server.com:5001`
  - port `80` (http) or `443` (https) may be ommitted for those schemes.
- Set `Hosted:AdminPassword` to the password for your admin user.
- Set `Hosted:JwtSigningKey` to a [JSON Web Key](https://mkjwk.org)
- [Optional] set `Hosted:AdminUsername` to a username for your admin user.
  - The app will prefix this username with `@` to identify it as the system admin.
  - if you set this in the config as `decsys`, then you'll need to login with `@decsys`.
  - defaults to `admin`.

#### DECSYS JSON Web Key Parameters

| Parameter | Values | Notes |
|-|-|-|
| Type (`kty`) | `RSA` | No validation occurs, but other values will fail. |
| Use (`use`) | `Signature` | DECSYS doesn't validate this at this time but may in future. |
| Algorithm (`alg`) | `RS256` | No validation occurs, but other values will fail.<br />Other values will be accepted in future. |

### How to configure DECSYS

:::tip Simple configuration
Just add an `appsettings.Production.json` in the DECSYS application directory.
:::

DECSYS reads configuration from the following locations:
- `appsettings.json`
- `appsettings.<Environment>.json`
  - `<environment>` defaults to `Production`
- Specific JSON files inside `settings/`
- Environment variables

#### Configuring with JSON

When using JSON files to configure .NET apps, the colons (`:`) in keys represent a level of hierarchy.

Example:
```json
{
  "ConnectionStrings": {
    "mongo": "mongodb://localhost:27017"
  },
  "WorkshopMode": false,
  "Hosted": {
    "Origin": "https://my-decsys-server.com:5001",
    "AdminPassword": "hunter2",
    "JwtSigningKey": {
      // ... JSON Web Key
    }
  }
}
```

#### Configuring with Environment Variables

Configuring .NET apps with Environment Variables is [documented here](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-5.0#environment-variables).

However, all you really need to know is the following:
- in general:
  - prefix environment variables with `DOTNET_`
  - replace `:` with `__` (*double* underscore) in the keys above
- for connection strings:
  - use the prefix `CUSTOMCONNSTR_` instead of `ConnectionStrings:`
    - [as documented here](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-5.0#connection-string-prefixes)

Example:
```
CUSTOMCONNSTR_mongo=mongodb://localhost:27017
DOTNET_WorkshopMode=false
DOTNET_Hosted__Origin=https://my-decsys-server.com:5001
DOTNET_Hosted__AdminPassword=hunter2
DOTNET_Hosted__JwtSigningKey=<JSON Web Key>
```

