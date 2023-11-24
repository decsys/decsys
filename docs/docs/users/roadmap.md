---
title: Roadmap
---

## 2.x Future

:::info
🙂 Some of these items may be brought forward into the next release.

☹ Some of them may fall into later releases...
:::

- Continued customisation of generated Participant Identifiers
  - e.g. to exclude undesirable combinations of nouns and adjectives, or to add your own!
- More Webhook trigger conditions
- FreeText Regex validation
- Participant User Accounts
  - Requiring accounts to take surveys
  - Limit accounts / Invite usernames to take surveys
- Remote Image Uploads
  - Native Azure StorageAccount store (this will enable the use of CosmosDb for the main datastore)
- Sharing Survey Administration between accounts
- new Params Editor / ParamTypes
- Logical branching - new Survey Structure Editor
- Tagging/Labelling further export data fields

## 3.x

- Move WorkshopMode to an embedded mongo instance, so we only target one database api
- Consider an electron app or similar webview wrapper for workshop mode?

## Changelog

### 2.4.0

- Mandatory questions can no longer be reset with the "Clear Response" button
  - if a user is unhappy with their response they can amend it before moving on
  - Optional questions must be resettable in case a user decides they want to skip the response after having already entered a response.
- Users can maintain a single modified list of words used for id generation in Surveys they manage.
  - Currently they can choose to block words form the built-in list, or unblock previously blocked ones.
  - More functionality will be added in future.
- Surveys can have webhooks configured, to allow integrating with external systems in response to DECSYS events.
  - Currently the only DECSYS event that can trigger a webhook is a PAGE_NAVIGATION, when leaving a Survey page.
  - Multiple webhooks can be configured for a Survey.
  - Webhooks can currently trigger on ALL PAGE_NAVIGATION events, or only when leaving specified pages.
  - In future other events will be able to trigger payloads, possibly with differing payloads.
  - In future PAGE_NAVIGATION triggers will be more customisable beyond just the page being left.
  - Webhooks are documented in the User Guide.
  - Webhook functionality is currently behind a feature flag

### 2.3.x

- Performance improvements for results page/dashboard/data exports
- Choose Many Response item (highly requested!)
- Number input Response item
- Mandatory / Optional questions
  - Pages can be marked as optional / mandatory
  - Dashboard distinguishes between Pages not yet responded to vs optional Pages skipped
