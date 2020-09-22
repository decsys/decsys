---
title: Roadmap
---

## 2.0
- [ ] Hosted Mode
    - [x] Remote Admin Login
    - [x] Remote Database
        - [x] MongoDB
        - [x] Investigate CosmosDB support (via the Mongo API)
          - CosmosDB works for the data store, but not the image store
    - [x] Remote Image Uploads
        - [x] MongoDB as a store
    - [x] Multiple Admin User Accounts
      - [x] New account registration supported
      - [x] Registration requires email confirmation
      - [x] Each account has their own distinct Surveys collection
      - [x] Registration requires optional approval
      - [ ] Password change / reset functionality
      - [ ] Email address change
      - [ ] General profile editing

## 2.x Future

:::info
🙂 Some of these items may be brought forward into 2.0.

☹ Some of them may fall into later releases...
:::

- Participant User Accounts
  - Requiring accounts to take surveys
  - Limit accounts / Invite usernames to take surveys
- Remote Image Uploads
  - Native Azure StorageAccount store (this will enable the use of CosmosDb for the main datastore)
- Sharing Survey Administration between accounts
- new Params Editor / ParamTypes
