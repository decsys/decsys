---
title: Events
---

In Decsys, webhooks are designed to trigger on specific events, particularly focusing on page navigation within the application. This document provides a detailed overview of how these webhooks operate.


### 1. All Events
Select this option to activate webhooks for every page navigation event, providing comprehensive monitoring across the entire survey workflow.
- **Trigger**: Activates on every page navigation event.
- **Current Scope**: Limited to Page Navigation events but may expand in the future.


### 2. Customize Events - Page Navigation
This feature allows targeting specific pages for webhook triggers. By setting criteria for chosen source pages, it offers tailored monitoring for selected segments of the application.

- **Target Specific Pages**:
  - Allows for monitoring specific pages or types of navigation events.
  - Webhooks can be set to trigger based on the defined source pages.
- **All Page Navigation**:
  - Activates the webhook for every page navigation event.
  - Functions similarly to the 'All Events' option, given the current scope.

## How and When They Occur

- **Page Navigation Events**: Trigger when a user navigates to a new page within the survey or completes an action such as clicking "next" or "finish".
- **Configurability**: Webhooks can be tailored for various scenarios, from tracking all pages to focusing on specific pages or opting out of page navigation tracking.

## Trigger Filter (Source Page) Parameters

- **Purpose**: To define specific pages that will activate the webhook.
- **Functionality**: Enables focused monitoring on selected segments of the survey.
- **Flexibility**: Can be adjusted to track user interactions at crucial points, like form submissions or important decisions