using Decsys.Constants;
using Newtonsoft.Json;

namespace Decsys.Models.Webhooks;

public class EventTriggerFilters
{
    [JsonProperty(WebhookEventTypes.PAGE_NAVIGATION)]
    public List<PageNavigationFilters> PageNavigation = new();
}
