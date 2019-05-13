using System;
using System.Collections.Generic;

namespace Decsys.Models
{

    /// <summary>
    /// An export model for the results data of a survey instance
    /// </summary>
    public class SurveyInstanceResults<T>
    {
        /// <summary>
        /// A timestamp for when the summary was produced
        /// </summary>
        public DateTimeOffset Generated { get; set; }

        /// <summary>
        /// The timestamp which identifies the Survey Instance
        /// </summary>
        public DateTimeOffset Instance { get; set; }

        /// <summary>
        /// The name of the survey the instance (and therefore these results) belong to
        /// </summary>
        public string Survey { get; set; } = string.Empty;

        /// <summary>
        /// The instance participants and their export data
        /// </summary>
        public List<T> Participants { get; set; } = new List<T>();
    }
}
