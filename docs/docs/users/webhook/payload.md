---
title: Payload
---

# Decsys Webhook Payload Structure

A webhook payload in Decsys is a structured JSON data object that provides detailed information about specific events within the Decsys application. This payload is automatically transmitted to a pre-configured URL whenever the corresponding event is triggered. Below is an overview of the key components in a typical Decsys webhook payload.

## General Structure

- **Timestamp**: The exact time at which the webhook event was triggered.
- **Survey ID**: A unique identifier assigned to the survey where the event took place.

## Payload

The payload section of the webhook contains detailed data pertaining to the event. It typically includes the following elements:

- **Participant ID**: The unique identifier of the survey participant.
- **Survey Started**: The timestamp marking the start of the participant's survey session.

### Responses Array

This array is a collection of individual response objects, each corresponding to a specific interaction of the participant with the survey. The objects encompass:

- **Page**: The numeric identifier of the page in the survey where the response was provided.
- **Page Name**: The title or name of the survey page.
- **Question**: The exact question or prompt asked to the participant.
- **Response Type**: The format or type of the response, such as :
  - Choose One
  - Choose Many
  - Number
  - Free Text
  - Confirmation
  - Discrete Scale
  - Ellipse Scale
  - Multi Visual Analog Scale
  - Visual Analog Scale

- **Order**: The ordinal position of the question in the survey's sequence.
- **Response**: The actual response given by the participant, detailed in elements like `index/label` and `value`.
- **Page Load**: A timestamp indicating the moment when the survey page was loaded by the participant.
- **Response Recorded**: A timestamp marking when the participant's response was recorded by the system.
- **Is Optional**: A boolean value indicating whether the question was optional or mandatory for the participant.

This structure of the webhook payload provides a comprehensive view of the participant's journey and interactions within the survey, enabling detailed analysis and insights.
