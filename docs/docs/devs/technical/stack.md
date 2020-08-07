---
title: Tech Stack
---
The Survey Platform application consists of the following parts:

- A NoSQL database
- A REST API backend application
- A Client-side frontend application
- Dynamically loaded external Response Components

At this time, all of these parts are run in-process by the backend application.

## Database

The Database used is [LiteDB], which is an embedded NoSQL database for .NET Standard.

- It uses the MongoDB API and is similarly featured to Mongo, so should be accessible for people used to working with NoSQL.
- It's embedded, allowing the single-process design to simplify zero-config running of the Survey Platform for Admins.
- It's for .NET, for which the backend application (the host process) is written.

## Backend

The Backend application is an ASP.NET Core 3.1 MVC REST API.

- It's [.NET Core] so it's cross-platform for Linux, macOS and Windows.
- It's self-hosting - it doesn't require a reverse proxy in front of it.
- It's capable of hosting different content at different routes
    - in the case of the Survey Platform:
        - there are some custom routes which bypass the MVC framework (e.g. `/version`)
        - there are routes to the Client Side application
        - there are routes to MVC controllers (e.g. `/api/...`)

The above points allow keeping with the single-process design. Users can just run the backend and everything comes up.

- The backend can be published as a platform binary which can run anywhere the platform ([.NET Core]) runtime is available.
- It can also be published as a native executable binary for supported platforms (e.g. `decsys.exe` for Windows).

## Frontend

The Frontend application is a Client Side [React] Single Page Application.

- It's pure JavaScript
    - It is however modern ECMAScript, so is transpiled using Babel.
- It uses a very popular component driven framework: [React]
    - This should be beneficial for developer accessibility
    - It really helped enable the ability to dynamically load external components
- It's hosted by the Backend application process.

## Components

External Response Components are written as [React] Components, with some additional metadata. Refer to the [`component-boilerplate` wiki](https://github.com/decsys/component-boilerplate/wiki) for detailed information on the structure of Response Components and how to write them.

- They're [React], the same as the Frontend app.
    - They use [Styled Components] so they can be bundled into a single JavaScript file, but still be styled.
- They're modern ECMAScript, using the ES Modules standard
- They're discovered and served by the Backend app at runtime
    - You can drop new components into the `components/` folder locally, and only a page refresh is required to load them.
- They're loaded by the frontend as ES Modules at runtime.
- NoSQL allows us to store response data with flexible schema defined by the Response Components, not the Platform.
- [React] allows Components to use PropTypes to define Parameter and Response schema that the Platform can validate or interact with (e.g. providing a rich editor UI).

[litedb]: https://www.litedb.org/
[.net core]: https://dotnet.microsoft.com/
[react]: https://reactjs.org/
[styled components]: https://www.styled-components.com/
