---
title: Configuration
---


## How to Configure Webhooks per Survey
1. **Access Webhook Management:** In the Decsys application, while creating or editing a survey, click on the menu button next to the "+ Add Page" button. From the dropdown, select "Manage webhooks."

2. **Add a New Webhook:** In the webhook management section, you have the option to create a new webhook. Click on the "Create a webhook" button to start the setup.

3. **Configure Webhook Details:**
   - **Callback URL:** Enter the URL where you want the webhook notifications to be sent. This URL will receive the webhook payloads.
   - **Secret Generation (Optional):** You can choose to generate a secret for added security. This secret helps in verifying that the requests to your callback URL are from Decsys.
   - **SSL Verification:** Decide whether to enable or disable SSL verification. If enabled, it adds a layer of security by ensuring the SSL certificate of the receiving server is valid.
   - **Event Selection:** Choose the events that will trigger your webhook. You can select either "All Events" or customize specific events for triggering the webhook.

4. **Save the Webhook:** Once all details are filled in, save the webhook configuration. 
In Decsys, webhooks are a powerful feature that can be triggered by various events, particularly page navigation events. This functionality enables real-time monitoring and reaction to user actions within an application. Currently, the primary event type available is Page Navigation, but the system is designed to accommodate additional types in the future.

Remember, you can always go back to edit or delete webhooks. This flexibility allows you to modify your webhook configurations as your survey needs change or evolve.


### How to Test a Webhook in Preview Mode

Testing a webhook in preview mode is crucial to ensure it functions as expected. Here's how to do it:

1. **Initiate Preview Mode:** After setting up your webhook, click preview.

2. **Trigger the Webhook:** Navigate through the survey and a notification will pop up for the pages that are set up to trigger the webhook. 

3. **View the Notification:** Once the webhook is triggered, a notification will appear. This is an indication that the webhook has been successfully activated.

4. **Access the JSON Payload:**
   - The notification will display the JSON payload that the webhook sends. 
   - This payload contains the data that is transmitted to the specified URL when the webhook is triggered.
   - For more information about JSON and its structure, [click here](./payload).

5. **Export the Webhook Data (Optional):**
   - Use the "Export Webhook" button if you wish to save or analyze the webhook's data externally.
   - This feature is useful for record-keeping or further technical inspection of the webhook's performance.

By following these steps, you can effectively test and verify the functionality of your webhook in a controlled environment before deploying it in a live survey.
