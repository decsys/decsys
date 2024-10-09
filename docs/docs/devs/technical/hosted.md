---
title: Hosted Mode
---

In **Hosted** mode, DECSYS is designed to run as a typical web application, on a typical sort of infrastructure.

The expected infrastructure at this time consists of:
- A web server for the DECSYS App itself
- A MongoDB server for the app databases

### DECSYS App

The **.NET Backend API** is a web application:
- It hosts and serves the Frontend Web App.
- It hosts and serves Custom Response Items.
- It hosts a built in Identity Provider to manage user access.
- In Hosted mode in Production, it **should be run over HTTPS**.

You can host it however you prefer:
- It is capable of self-hosting, binding to HTTP/HTTPS on any suitable ports.
- You can put it behind a reverse proxy such as nginx, Apache, IIS etc.
- You can run it in Docker. [Start here](https://hub.docker.com/_/microsoft-dotnet-nightly-aspnet/)
- You can host it in the Cloud
  - For example, in Azure:
    - Deploy DECSYS to Azure App Service
    - Use SendGrid in Azure for email
    - Use MongoDB for the Database and Image Storage!

### Image Storage

Images are served by the Backend API, but they may need to be stored differently, depending on your hosting approach.

Currently, the Backend API stores images in the same MongoDB database as everything else, using GridFS. In future, using other stores may be possible (e.g. Azure StorageAccount).

### Identity

The Backend API stores all user details in the primary database `decsys`.
It always ensures a single super user (`admin@localhost`) is present, with a username and password configured on the hosting environment.

That user has **Admin** access and can create **Surveys**.

Additional users can be registered, and will also be **Admin** users who can create **Surveys**.

The Identity service is an Open ID Connect compliant Token provider, currently using only its own userstore, and supporting just a single client: the Frontend Web App.

### Database

All other data is stored in a remote MongoDB database (`4.x` or newer), to which the Backend API connects.

Currently Survey configuration data and Survey Instance metadata are stored in a primary database called `decsys`, and Participant Event Logs are stored in a separate database per Survey Instance. Each of these databases is prefixed `decsys_events_`.

### Webhooks

DECSYS supports webhooks to facilitate integration with external services. By default, **triggering webhooks is blocked during development mode** to prevent unintended external calls. Developers can enable webhooks and override the webhook URL during development for testing purposes.

#### Enabling Webhooks in Development Mode

To enable webhooks during development, adjust the `Webhooks` configuration section in your `appsettings.json` or environment-specific configuration files.

#### Example Configuration

```
{
  "Webhooks": {
    "OverrideWebhookForDev": true,
    "GlobalRedirectUrl": "https://webhook.site/your-unique-url"
  }
}
```

- `OverrideWebhookForDev`: 
  - `true`: Allows webhooks to be triggered during development mode. You can also specify a `GlobalRedirectUrl` to override all webhook URLs for testing purposes.
  - `false`: Webhooks will behave as configured in the web application without any overrides. This means that if the webhooks are set up in the app, they will function normally even in development mode.
- `GlobalRedirectUrl`: *(Optional)* Specify a URL to which all webhook calls will be redirected. This is useful for testing webhooks without invoking actual external services.

#### Notes
**Default Behavior in Development Mode:** If `OverrideWebhookForDev` is not set or is set to false, webhooks will be blocked during development mode to prevent unintended external calls.
**Security Considerations**: Enabling webhooks in development should be done cautiously, especially if the webhooks perform sensitive operations.
**Testing Tools**: Services like webhook.site can be used to receive and inspect webhook payloads for testing purposes.