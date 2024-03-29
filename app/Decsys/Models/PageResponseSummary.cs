using System;
using Newtonsoft.Json.Linq;

namespace Decsys.Models
{

    /// <summary>
    /// An export model for a participant's response to a given question
    /// </summary>
    public class PageResponseSummary
    {
        /// <summary>
        /// The canonical Page number from the survey configuration
        /// i.e. as the Admin sees it
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// The user specified name for the Page
        /// </summary>
        public string PageName { get; set; } = string.Empty;

        /// <summary>
        /// The content used as the "Question Content"
        /// from the Page Item designated as the "Question Item"
        /// </summary>
        public string? Question { get; set; } = null;

        /// <summary>
        /// The question component type
        /// </summary>
        public string ResponseType { get; set; } = string.Empty;

        /// <summary>
        /// The question number the participant saw the question as
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// The participant's response data
        /// </summary>
        public JObject? Response { get; set; }

        /// <summary>
        /// A timestamp of when the question page fully loaded
        /// </summary>
        public DateTimeOffset PageLoad { get; set; }

        /// <summary>
        /// A timestamp of when the participant submitted their response
        /// </summary>
        public DateTimeOffset ResponseRecorded { get; set; }

        /// <summary>
        /// Whether the response is optional or not.
        /// </summary>
        public bool IsOptional { get; set; }
    }
}
