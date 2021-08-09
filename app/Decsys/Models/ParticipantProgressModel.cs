namespace Decsys.Models
{
    /// <summary>
    /// A model representing a Participant's progress through a Survey,
    /// including Survey Instance metadata required for the app to allow the Participant to proceed.
    /// </summary>
    public class ParticipantProgressModel
    {
        /// <summary>
        /// Participant Id, if any, provided in the progress request
        /// </summary>
        public string? ParticipantId { get; set; }

        /// <summary>
        /// <para>Replacement Participant Id issued by the server which should be used to progress further.</para>
        /// <para>
        /// This occurs if the originally provided participant id has completed the survey, but repeats are allowed:
        /// repeats should use the provided progress state and the new id.
        /// </para>
        /// </summary>
        public string? NewParticipantId { get; set; }

        /// <summary>
        /// The page this participant is at
        /// </summary>
        public Page? Page { get; set; }

        /// <summary>
        /// Is the participant's current page the last one in their order.
        ///
        /// Just information for the UI to respond to (changes "Next" to "Finish" for example).
        /// </summary>
        // TODO: Will cease to be relevant when progress provides an ordered pages map
        public bool IsLastPage { get; set; }

        /// <summary>
        /// A count of pages in the Survey. 0 page Surveys should be considered invalid.
        /// </summary>
        // TODO: may replace this with a participant ordered map
        // of mandatory/optional/completed questions in future for navigation purposes
        public int PageCount { get; set; }

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
        public bool UseParticipantIdentifiers { get; set; }
    }
}
