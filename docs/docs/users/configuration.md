---
title: Configuration
---

:::info Hosted Mode only
Currently there is no (documented) configuration for using Decsys in **Workshop Mode**.
:::

## Configuration Options

Here are the configurable settings you can change currently in DECSYS:

### Top Level

| Key | Type | Description |
|-|-|-|
| `WorkshopMode` | `bool` | Specify whether DECSYS is in **Workshop** mode |

### Connection Strings

Prefix keys with `ConnectionStrings:`

| Key | Description |
|-|-|
| `mongo` | A MongoDB connection string |

### Hosted

Prefix keys with `Hosted:`

Refer to the [Hosted mode Installation Guide](installation#hosted-mode-setup) for details on the required settings.

| Key | Type | Description |
|-|-|-|
| `Origin` | `string` | Scheme, Hostname (and Port if non-default) where the application is running |
| `AdminPassword` | `string` | Password to set for the default Admin user |
| `AdminUsername` | `string` | Username for the default Admin user. Add `@` to the start of this string when logging in. |
| `JwtSigningKey` | `object` | A JSON Web Key to use for signing Auth tokens. Generate one at `https://mkjwk.org`. |
| `AllowRegistration` | `bool` | Can people register User Accounts? <br /> If `false` the default Admin user as configured above will be the only Survey Admin <br /> If `true`, Outbound Email settings must be configured to allow user account functionality. |

### Outbound Email

Prefix keys with `Hosted:OutboundEmail`.

Some settings relate to specific providers only.

| Key | Type | Provider | Description |
|-|-|-|-|
| `Provider` | `string` | - | Which email provider to use. <br /> One of: `local` `sendgrid` <br /> Defaults to `local` |
| `FromAddress` | `string` | * | The Email Address to send mail from. <br /> For **SendGrid** this **must** match a [Verified Sender](https://sendgrid.com/docs/for-developers/sending-email/sender-identity/) on the SendGrid account. <br /> Defaults to `noreply@example.com` |
| `FromName` | `string` | * | The Name for the email's From field. |
| `ReplyToAddress` | `string` | * | The Email Address for the ReplyTo field. <br /> Defaults to the same as `FromAddress`. |
| `LocalPath` | `string` | `local` | The path on disk that `.eml` files should be written to. <br /> Please ensure the path exists. <br /> Defaults to `/temp` |
| `SendGridApiKey` | `string` | `sendgrid` | Your SendGrid API Key. Must be allowed to send mail.

## How to configure DECSYS

:::tip Simple configuration
Just add an `appsettings.Production.json` in the DECSYS application directory.
:::

DECSYS reads configuration from the following locations:
- `appsettings.json`
- `appsettings.<Environment>.json`
  - `<environment>` defaults to `Production`
- Specific JSON files inside `settings/`
- Environment variables

### Configuring with JSON

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

### Configuring with Environment Variables

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
