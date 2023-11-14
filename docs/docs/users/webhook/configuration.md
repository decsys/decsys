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
   - Upon triggering, a notification appears with an option to view the [JSON payload](./payload).
   - The payload provides the data sent to your URL.

4. **Export Option:**
   - Use "Export Webhook" to download a zip file with the payloads for external analysis or record-keeping.


### Editing and Deleting Webhooks

Once you have set up and saved your webhook configurations in Decsys, you maintain the flexibility to make changes or remove them entirely. This section briefly explains how you can edit or delete your webhooks.

#### Editing a Webhook
- **Access Webhook Settings:** Navigate to the webhook management section.
- **Select the Webhook:** Choose the webhook you wish to edit.
- **Make Changes:** Update the callback URL, trigger filters, or any other settings as needed.
- **Save Changes:** Ensure to save your edits for them to take effect.

#### Deleting a Webhook
- **Locate the Webhook:** Go to the webhook management area and find the webhook you want to remove.
- **Delete Option:** Select the delete button for the respective webhook.
- **Confirm Deletion:** You will be prompted to confirm the deletion to prevent accidental removal.

### Event Types and Trigger Filters

#### All Events
- This option triggers the webhook for every event within the survey, offering comprehensive monitoring.

#### Custom Events
- Customize the webhook to trigger for specific events, enhancing targeted monitoring.

### Trigger Filters for Page Navigation

In Decsys, the trigger filters for Page Navigation enable you to specify which pages in a survey will activate the webhook. This feature is particularly useful for surveys where monitoring specific pages is crucial. Here is a step-by-step guide to setting up trigger filters for Page Navigation. 

#### Step-by-Step Guide to Configuring Trigger Filters
1. **Access the Trigger Filter Settings:**
   - From the webhook configuration interface, click on "Customize Events" to access the trigger filter settings.

2. **Specify Source Pages:**
   - Enter the page number of the survey you wish to monitor. This tells the webhook to activate only when these specific pages are navigated.

3. **Opting for Broad Monitoring:**
   - If no specific pages are added to the trigger filters, the webhook  will trigger on every page navigation within the survey.

4. **Review and Confirm:**
   - Once you've specified the pages and defined the criteria, review your settings to ensure they align with your monitoring goals.
   - Confirm and save the settings to activate the trigger filters for your webhook.
   - You can test these webhook settings in preview mode.

By following these steps, you can effectively configure the trigger filters to focus your webhook monitoring on specific pages within your Decsys survey. This allows for a more targeted approach in tracking user interactions and responses.
