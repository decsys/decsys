---
title:  Configuration 
---

## Setting Up Webhooks for Individual Surveys

### Step-by-Step Guide to Creating Webhooks
1. **Navigate to Webhook Management:**
   - In Decsys, access the webhook management feature by selecting "Manage webhooks" from the menu adjacent to the "+ Add Page" button in the survey editor.

2. **Creating a New Webhook:**
   - Click on "Create a webhook" in the management section to initiate the setup process.

3. **Configuring Webhook Details:**
   - **Callback URL:** Specify the URL where webhook notifications will be sent.
   - [**SSL Verification:**](./security#ssl-verification-in-webhooks) Choose to enable or disable SSL verification for added security.
   - [**Event Selection:**](./configuration#event-types-and-trigger-filters) Decide between triggering the webhook on "All Events" or select specific events for activation.

4. **Finalizing the Webhook:**
   - Save your webhook settings once all details are configured.

### Testing Webhooks in Preview Mode
Testing your webhook in preview mode is essential to ensure its functionality. Here's the process:

1. **Initiate Preview Mode:**
   - Start the preview after setting up your webhook.

2. **Triggering the Webhook:**
   - Navigate through the survey to activate the webhook.

3. **Notification and Payload Review:**
   - Upon triggering, a notification appears with an option to view the JSON payload.
   - The payload provides the data sent to your URL.

4. **Export Option:**
   - Use "Export Webhook" for external analysis or record-keeping.

### Event Types and Trigger Filters

#### All Events
- This option triggers the webhook for every event within the survey, offering comprehensive monitoring.

#### Custom Events
- Customize the webhook to trigger for specific events, enhancing targeted monitoring.

### Trigger Filters for Page Navigation
Currently, Page Navigation is the primary event type for webhooks in Decsys, with the flexibility to include more event types in the future.

#### Page Navigation
- **Purpose:** Allows the webhook to respond to specific page navigations within the survey.
- **Flexibility:** Customizable to focus on critical survey segments or specific user interactions.

Remember, you can always modify or delete webhooks as your survey evolves. This guide will be updated as new event types and trigger filters become available.
