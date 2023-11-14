---
title: Events
---

Decsys webhooks are integral for monitoring user interactions within the application, especially during page navigations. This guide provides insights into the types of events that can trigger webhooks and their operational specifics.

### Overview of Webhook Events

#### 1. All Events
- **Description**: Triggers webhooks for every page navigation within Decsys, offering a broad overview of user interactions.
- **Trigger Details**: Activates upon any page navigation event within the survey.
- **Scope**: Currently limited to Page Navigation events, with potential for future expansion.

#### 2. Customizable Events - Focused on Page Navigation
- **General Function**: Allows precise targeting of specific pages for webhook activation, enhancing event-specific monitoring.
  
  - **All Page Navigation**: 
    - **Trigger**: Engages webhook on all navigation events.
    - **Comparison**: Similar in function to the 'All Events' setting, within the present context.

  - **Target Source Pages**:
    - **Objective**: To observe activities on predetermined pages.
    - **Trigger Mechanism**: Webhooks fire when navigation occurs on or from specified pages.

### Detailed Trigger Filter Parameters

#### Page Navigation - Source Page
- **Purpose**: To identify and select specific source pages for webhook activation.
- **Functionality**: Tailors the monitoring process to critical segments of the survey, such as key questions or form submissions.
- **Customization**: Users can configure the system to focus on specific user interactions, enhancing data relevance and accuracy.
