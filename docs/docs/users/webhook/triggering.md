---
title: Triggering a Webhook
---

## Manual Webhook Triggering via CLI

DECSYS provides a command-line interface to manually trigger webhooks for a specific survey instance participant event.

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
