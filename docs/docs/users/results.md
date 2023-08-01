---
# TODO: Improve these rudimentary notes
title: Results
---

There are some idiosyncracies around how DECSYS stores results sometimes, but they map to clear behaviours, so if you are looking at a full or summary results log, you can decode the participant behaviours using the following details:

| Behaviour | Full Results | Summary Results | Notes |
|-|-|-|-|
| Participant has never answered or left the page | No `COMPONENT_RESULTS` events | `null` response | This is when a participant has loaded a page with a response but not answered, or proceeded to a later page. |
| Participant has never answered and moved on to a later page | no `COMPONENT_RESULTS` events | `{}` empty response | If a participant moved, then this page counts as "skipped", which the summary differentiates by logging a definitely empty response, rather than an absence of response. In the full results, you can clearly see that they navigated to a later page and can infer that they therefore skipped the page with no response events. |
| Participant has responded | one or more `COMPONENT_RESULTS` events containing timestamped responses | The latest timestamped response value. | |
| Participant responded but then cleared their response | One or more `COMPONENT_RESULTS` events, the latest of which will contain an empty `{}` response. | `{}` empty response | Again here the `{}` shows a definitive empty response rather than absence; the difference is the full log also contains it, to log the invalidation of previously recorded values. |

Within DECSYS itself, the Results and Dashboard pages interpret the results summary based on the above, as follows:

| Summary response value | Results view | Dashboard |
|-|-|-|
`null` | `- response not recorded -` | Shows as page currently unanswered |
| `{}` | `- response not recorded -` | Shows as page skipped |
| `{ ...values }` | `{ ...values }` | Shows as page completed |
