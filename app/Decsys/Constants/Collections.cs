namespace Decsys.Constants
{
    public static class Collections
    {
        #region Primary DB

        public const string Surveys = "Surveys";

        public const string SurveyInstances = "SurveyInstances";

        public const string ExternalLookup = "ExternalLookup";

        public const string Images = "images_";

        // Users
        public const string Users = "Users";
        public const string Roles = "Roles";
        public const string Grants = "Grants";

        public const string Webhooks = "Webhooks";

        #endregion

        #region Instance DBs

        public const string InstanceDb = "events_";

        // Participant Instance Events
        public const string EventLog = "e";
        public const string EventLogLookup = "l";

        // Study Instances
        public const string StudySurveyAllocations = "Allocations";
        public const string RandList = "RandList";

        #endregion

        #region Wordlist DBs

        public const string UserWordlists = "UserWordlists";

        #endregion
    }
}
