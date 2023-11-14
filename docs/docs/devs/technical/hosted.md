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
