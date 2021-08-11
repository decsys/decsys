using Newtonsoft.Json;

namespace Decsys.Models.EventPayloads
{
    public class PageNavigationEventPayload
    {
        /// <summary>
        /// A valid navigation token, Page Id requested to navigate to
        /// </summary>
        public string PageRequested { get; set; }

        public PageNavigationEventPayload(string pageRequested, string? targetPageId = null)
        {
            PageRequested = pageRequested;
            TargetPageId = targetPageId;
        }

        /// <summary>
        /// The validated target page id to navigate to (may not match the requested page if it wasn't valid due to state)
        /// </summary>
        public string? TargetPageId { get; set; }
    }
}
