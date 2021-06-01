
using System;

namespace Decsys.Data.Entities.Mongo
{

    public class ExternalLookup : BaseExternalLookup
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public ExternalLookup() { }

        public ExternalLookup(string externalKey, string externalId, Survey survey)
            : base(externalKey, externalId)
        {
            Survey = survey;
        }

        public Survey Survey { get; set; } = new();

        public SurveyInstance? Instance { get; set; }
    }
}
