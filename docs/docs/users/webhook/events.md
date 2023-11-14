---
title: Events
---

Decsys webhooks are integral for monitoring user interactions within the application, especially during page navigations. This guide provides insights into the types of events that can trigger webhooks and their operational specifics.

### Overview of Webhook Events

#### 1. All Events
- **Description**: Triggers webhooks for every page navigation within Decsys, offering a broad overview of user interactions.
- **Trigger Details**: Activates upon any page navigation event within the survey.
- **Scope**: Currently limited to Page Navigation events, with potential for future expansion.

#### 2. Customizable Events 
- **Page Navigation**: Allows precise targeting of specific pages for webhook activation, enhancing event-specific monitoring.

#### All Page Navigation
- **Function**: This setting triggers the webhook for every page navigation event in the survey.
- **Use Case**: Ideal for surveys requiring thorough monitoring across all pages, ensuring no navigation event is missed.

#### Trigger Filter
- **Purpose**: The trigger filter allows you to define specific pages that will activate the webhook.
- **Configuration**: Users can enter page number in the trigger filter settings. When a respondent completes the question by clicking next or finish the webhook is triggered.
- **Flexibility**: If no pages are specified in the trigger filter, the webhook defaults to the "All Page Navigation" setting, activating on every page navigation event.
- **Customization**: This feature is especially useful for surveys that require focused monitoring on certain pages, such as key questions or critical survey sections.

To learn more about the payload that gets triggered [click here](./payload), optionaly you can test webhooks in preview mode.
