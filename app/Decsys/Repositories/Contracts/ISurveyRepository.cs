using Decsys.Models;

using System.Collections.Generic;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyRepository
    {
        /// <summary>
        /// Get a Survey
        /// </summary>
        /// <param name="id">The ID of the Survey to fetch</param>
        Survey Get(int id);

        IEnumerable<SurveySummary> List();
        int Create(string? name = null);
        int Import(Survey survey);
        void Delete(int id);
        void EditName(int id, string name);
        void Update(Survey survey);

        /// <summary>
        /// Check if a Survey exists
        /// </summary>
        /// <param name="id">The ID of the survey to look for</param>
        bool Exists(int id);
    }
}
