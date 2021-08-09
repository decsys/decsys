using Newtonsoft.Json;

namespace Decsys.Models.EventPayloads
{
    public class PageNavigationEventPayload
    {
        /// <summary>
        /// A valid navigation token, or Page Order or Page Id requested to navigate to
        /// </summary>
        [JsonProperty("pageRequested")]
        public string PageRequested { get; set; } = string.Empty;

        /// <summary>
        /// The validated target page order value to navigate to (may not match the requested page if it wasn't valid due to state)
        /// </summary>
        [JsonProperty("targetPageOrder")]
        public int TargetPageOrder { get; set; }
    }
}
