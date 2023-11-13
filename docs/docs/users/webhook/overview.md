---
title: Overview
---


### What are webhooks?
Webhooks are user-defined HTTP callbacks that are triggered by specific events. When an event occurs in a source site or application, a notification is sent to the URL configured for the webhook. 

### Why are they useful?
Webhooks are incredibly useful for creating real-time applications and for automating workflows. They enable applications to receive instant updates from other services. This immediate reaction to events makes webhooks ideal for scenarios where timely information is crucial, such as notification systems, continuous integration services, or real-time data synchronization.

### What event types can Decsys trigger webhooks for?
In Decsys, webhooks are activated by page navigation events. This includes scenarios when a user navigates to a new page or completes the survey, enabling real-time tracking of user interactions within the application.

To read more about what can trigger a webhook [click here](./events).


### What does a Decsys webhook payload look like?
A webhook payload in Decsys is a structured JSON data format that conveys information about an event within the Decsys application. This payload is sent to the configured URL when the specified event occurs. The general structure of a Decsys webhook payload includes several key components:

- **Timestamp:** Indicates the exact time when the webhook event occurred

- **Survey ID:** A unique identifier for the survey where the event occurred.

- **Payload:** This section contains additional data relevant to the event. It includes:
    - The participant's ID.
    - The time when the survey was started.
    - Responses array.

To read more about payload [click here](./payload).
