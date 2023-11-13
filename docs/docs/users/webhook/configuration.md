---
title: Configuration
---

## How to Create and Configure Webhooks in Decsys

### How to Create Webhooks

1. **Access Webhook Management:** In the Decsys application, click on the menu button next to the "+ Add Page" button. From the dropdown, select "Manage webhooks."

2. **Add a New Webhook:** In the webhook management section, you have the option to create a new webhook. Click on the "Create a webhook" button to start the setup.

3. **Configure Webhook Details:**
   - **Callback URL:** Enter the URL where you want the webhook notifications to be sent. This URL will receive the webhook payloads.
   - **Secret Generation (Optional):** You can choose to generate a secret for added security. This secret helps in verifying that the requests to your callback URL are from Decsys.
   - **SSL Verification:** Decide whether to enable or disable SSL verification. If enabled, it adds a layer of security by ensuring the SSL certificate of the receiving server is valid.
   - **Event Selection:** Choose the events that will trigger your webhook. You can select either "All Events" or customize specific events for triggering the webhook.

4. **Save the Webhook:** Once all details are filled in, save the webhook configuration. 

### How to Configure Webhooks per Survey

1. **Choose Event Type:**
   - **All Events:** This option will trigger the webhook for every page navigation event in the survey, providing comprehensive monitoring.
   - **Customize Events - Page Navigation:** This option allows you to target specific pages or types of navigation events. By specifying the criteria for chosen pages or events, you can tailor the monitoring to specific parts of the survey.

2. **Configure Trigger Filters:**
   - For each event type you select, you can set up filters that define under what specific conditions the webhook should be triggered. This could be based on user actions, survey progress, or other criteria relevant to the event.

3. **Save Changes:** After setting up the events and filters, save your configuration. 

Remember, you can always go back to edit or delete webhooks. This flexibility allows you to modify your webhook configurations as your survey needs change or evolve.