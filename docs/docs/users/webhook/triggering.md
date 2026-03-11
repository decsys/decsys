---
title: Triggering a Webhook
---

## Manual Webhook Triggering via CLI

DECSYS provides a command-line interface to manually trigger webhooks for a specific survey instance participant event.

### Prerequisites

To use the CLI, you need the `decsys.dll` file:

1. Download `decsys_dotnet-8.0.x.zip` from the [DECSYS GitHub releases](https://github.com/decsys/decsys/releases)
2. Extract the archive
3. Open a terminal and navigate to the extracted folder

### Getting Required IDs

The `participant-id` and `friendly-id` for the survey whose REDCap team transformation will be triggered should be obtained from the **REDCap team**.

#### Survey ID Calculation 

You can decode a friendly ID (e.g., `48z2v`) to calculate the actual Survey ID using the DECSYS ID encoding system. For example, if `48z2v` decodes to `91`, you can look up the user's DECSYS data in the collection `decsys_events_91` (where `91` is the decoded Survey ID). In the events collection, you can find your Survey Instance (e.g., `NounAnimal`).

#### Getting Required Event ID
Once you locate the participant's record, you can find the Event ID under the `payload` and `order` fields in the event data.

### Command Syntax

```bash
decsys webhooks trigger <friendly-id> <participant-id> <event-id> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<friendly-id>` | The DECSYS Combined Friendly Id for the target Survey Instance. |
| `<participant-id>` | The Id of the Participant in the target Survey Instance. |
| `<event-id>` | The Event Source value for which to trigger webhooks. For `PAGE_NAVIGATION` this is the id of the page the Participant is leaving. The last logged event with this source will be used. |

### Options

| Option | Description |
|--------|-------------|
| `-c, --connection-string <connection-string>` | Database Connection String if not specified in Configuration. |
| `-f, --force` | Bypasses webhook filter criteria checks and triggers all webhooks for the survey. |
| `-e, --environment <environment>` | Specify the environment. |
| `-?, -h, --help` | Show help and usage information. |

### Example Usage

```bash
dotnet decsys.dll webhooks trigger NounAnimal abc123 550e8400-e29b-41d4-a716-446655440000 --connection-string "Server=localhost;Database=decsys;" -f
```

This example triggers all webhooks for:
- Survey Instance: `NounAnimal`
- Participant: `abc123`
- Event ID: `550e8400-e29b-41d4-a716-446655440000`
- Using a custom connection string
- With the `-f` flag to bypass webhook filter criteria

### Verifying Webhook Success in REDCap

After triggering the webhooks, you can verify that the DECSYS data has been successfully transferred to REDCap:

1. Log in to REDCap
2. Navigate to **My Projects**
3. Click on your project's **Records**
4. Check the list of Participant IDs to verify that the DECSYS data has been filled
