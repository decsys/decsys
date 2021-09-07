using Newtonsoft.Json.Linq;

namespace Decsys.Models
{
    /// <summary>
    /// Parameters required, or accepted, when creating a Survey
    /// </summary>
    public class CreateSurveyModel
    {
        /// <summary>
        /// Optional Survey name; a default will be used if none given.
        /// </summary>
        public string? Name { get; set; }

        /// <summary>
        /// Optional Survey type; no type is a regular internal DECSYS Survey.
        /// </summary>
        public string? Type { get; set; }

        /// <summary>
        /// Is this Survey a Study; capable of having child Surveys?
        /// </summary>
        public bool IsStudy { get; set; }

        /// <summary>
        /// Dynamic settings for the survey; e.g. those that differ between different Survey types.
        /// </summary>
        public JObject Settings { get; set; } = new JObject();

        /// <summary>
        /// Optional ID of a Survey to attach this Survey to as a child.
        /// </summary>
        public int? ParentSurveyId { get; set; }
    }
}
