using Decsys.Constants;
using Newtonsoft.Json;

namespace Decsys.Models.Webhooks;

public class EventTriggerFiltersModel
{
    [JsonProperty(WebhookEventTypes.PAGE_NAVIGATION)]
    public List<PageNavigationFiltersModel> PageNavigation = new();
}
