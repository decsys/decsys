---
title: Overview
sidebar_label: Overview
slug: webhook/
---


### What are webhooks?
Webhooks are user-defined HTTP callbacks that are triggered by specific events. When an event occurs in a source site or application, a notification is sent to the URL configured for the webhook. 

### Why are they useful?
Webhooks are incredibly useful for creating real-time applications and for automating workflows. They enable applications to receive instant updates from other services. This immediate reaction to events makes webhooks ideal for scenarios where timely information is crucial, such as notification systems, continuous integration services, or real-time data synchronization.

### What event types can Decsys trigger webhooks for?
In Decsys, webhooks are activated by page navigation events. This includes scenarios when a user navigates to a new page or completes the survey, enabling real-time tracking of user interactions within the application.

- **All Events:** This option activates webhooks for every page navigation event, providing comprehensive monitoring across the entire application workflow.

- **Customize Events/Page Navigation:** This feature allows targeting specific pages for webhook triggers. By setting criteria for chosen source pages, it offers tailored monitoring for selected segments of the application.

### What does a Decsys webhook payload look like?
A webhook payload in Decsys is a structured JSON data format that conveys information about an event within the Decsys application. This payload is sent to the configured URL when the specified event occurs. The general structure of a Decsys webhook payload includes several key components:

- **Timestamp:** Indicates the exact time when the webhook event occurred

- **Survey ID:** A unique identifier for the survey where the event occurred.

- **Payload:** This section contains additional data relevant to the event. It includes:
    - The participant's ID.
    - The time when the survey was started.

- **Responses array:** This array includes individual response objects for each interaction the participant has with the survey. Each object in the array contains the following details:
    - **Page:** The specific page number in the survey where the response was recorded.
    - **Page Name:** The name or title of the survey page.
    - **Question:** The specific question or prompt to which the participant responded.
    - **Response Type:** The type or format of the response, such as multiple choice, text input, etc.
    - **Order:** The sequence number of the response, indicating its order in the survey flow.
    - **Response:** The actual response given by the participant.
    - **Page Load:** Timestamp indicating when the participant loaded the survey page.
    - **Response Recorded:** Timestamp indicating when the participant's response was recorded in the system.
    - **Is Optional:** A boolean indicator showing whether the response to the question is optional or mandatory.
