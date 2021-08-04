using Decsys.Models;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/progress")]
    [AllowAnonymous] // TODO: perhaps restrict this to `client-app` (but no user) in future?
    public class ParticipantProgressController : ControllerBase
    {
        public ParticipantProgressController()
        {

        }

        [HttpGet("{friendlyId}/{participantId}")]
        public ParticipantProgressModel? Get(string friendlyId, string? participantId)
        {
            // TODO: get query string params as well for external

            // 404 = instance not found

            // empty participant id = entry required

            // empty next page = survey completed / no pages

            return null;
        }
    }

    /// <summary>
    /// A model representing a Participant's progress through a Survey,
    /// including Survey Instance metadata required for the app to allow the Participant to proceed.
    /// </summary>
    public class ParticipantProgressModel
    {
        /// <summary>
        /// Participant Id issued by the server
        /// </summary>
        string? ParticipantId { get; set; }

        /// <summary>
        /// The next page this participant should see
        /// </summary>
        Page? NextPage { get; set; }

        /// <summary>
        /// A count of pages in the Survey. 0 page Surveys should be considered invalid.
        /// </summary>
        // TODO: may replace this with a participant ordered map
        // of mandatory/optional questions in future for navigation purposes
        int PageCount { get; set; }

        /// <summary>
        /// <para>
        /// Indicates whether this instance expectes Participants to provide Ids,
        /// instead of the server generating them.
        /// </para>
        /// <para>
        /// This should cause the frontend to both ask for an id interactively when starting a new Survey
        /// and to clear any stored id when completing a Survey.
        /// </para>
        /// </summary>
        bool UseParticipantIdentifiers { get; set; }
    }
}
