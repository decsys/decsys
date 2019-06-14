The Survey Platform Application is a single application designed to run self-contained on an "**Admin**" machine.

Once running, the user of the **Admin** machine can create and configure **Surveys**, and then launch them. They do this by accessing the running application via a web browser.

The data is stored locally on the **Admin** machine in a lightweight database.

Because the application runs a web server, other machines on the same network as the **Admin** machine can then connect to the machine as **Participants**, wherein they can take **Surveys** that have been launched by the **Admin**.

## Why a web app?

Web applications are a very straightforward way to produce a client/server application (in this case with multiple client **Participants** accessing one **Survey** server) using existing standard technology that is well understood. Users are also comfortable using their favourite web browser.

This approach allows the Platform to meet its original requirements of running on a local network with multiple **Participant** devices connecting. It also paves the way for producing an online hostable version of the application that could be used as a multi-user service. In that future scenario, multiple people with accounts could create and manage their own **Surveys** as **Admins**, and could invite **Participants** to complete them.

## Why all in a single process?

Although this is a web application with a database, and separate server and client parts, it is all currently run in a single process: You just run the one application and everything else is taken care of. This approach aids in the original intended local use of the Platform - on one physical **Admin** machine on a local network only. It means an easy zero-configuration approach to getting started making and running **Surveys**.

For future use in a hosted online service environment, it will be desirable to split up some parts of the application into separate processes - for example connecting to a separate database server instead of storing the data locally. It is intended to achieve this as an optional approach, to retain the best of both worlds for use in either scenario.
