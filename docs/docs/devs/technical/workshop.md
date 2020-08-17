---
title: Workshop Mode
---

In **Workshop** mode, DECSYS is designed to run self-contained on an "**Admin**" computer.

Once running, the user of the **Admin** computer can create and configure **Surveys**, and then launch them. They do this by accessing the running application via a web browser.

The data is stored locally on the **Admin** computer in a lightweight database.

Because the application runs a web server, other devices on the same network as the **Admin** computer can then connect as **Participants**, wherein they can take **Surveys** that have been launched by the **Admin**.

## Single Process Architecture

Although this is a web application with a database, and separate server and client parts, it is all currently run in a single process: You just run the one application and everything else is taken care of.

The **.NET Backend API** is the single host process for the whole platform:
- It is provided as a binary that can be run by the **Admin** user.
- It hosts and serves the Frontend Web App
- It hosts and serves any uploaded Images from disk
- It runs an in-process NoSQL Database, which stores data locally on disk.

This approach aids in the original intended local use of the Platform - on one physical **Admin** computer on a local network only. It means an easy zero-configuration approach to getting started making and running **Surveys**.

## Database

The Database used is [LiteDB] (`5.x`), which is an embedded NoSQL database for .NET Standard.

- It uses the MongoDB API and is similarly featured to Mongo, so should be accessible for people used to working with NoSQL.
- It's embedded, allowing the single-process design to simplify zero-config running of the Survey Platform for Admins.
- It's for .NET, for which the backend application (the host process) is written.

Currently Survey configuration data and Survey Instance metadata are stored in a primary database called `user-surveys.db`, and Participant Event Logs are stored in a separate database per Survey Instance. Each of these databases is prefixed `events_`.

[litedb]: https://www.litedb.org/
