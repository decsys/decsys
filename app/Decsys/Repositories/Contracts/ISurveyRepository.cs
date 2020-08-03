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

        /// <summary>
        /// List Summaries of all Surveys
        /// </summary>
        IEnumerable<SurveySummary> List();

        /// <summary>
        /// Insert a new Survey into the database
        /// </summary>
        /// <param name="name">Optional Survey name</param>
        int Insert(string? name = null);

        /// <summary>
        /// Creates a new Survey from a provided model
        /// </summary>
        /// <param name="survey">Survey model to import</param>
        int Import(Survey survey);

        /// <summary>
        /// Delete a Survey
        /// </summary>
        /// <param name="id">ID of the Survey to delete</param>
        void Delete(int id);

        /// <summary>
        /// Edit the name of a Survey
        /// </summary>
        /// <param name="id">ID of the Survey</param>
        /// <param name="name">New name</param>
        void EditName(int id, string name);

        /// <summary>
        /// Generally update a Survey from the provided model
        /// </summary>
        /// <param name="survey">Survey model to update from</param>
        void Update(Survey survey);

        /// <summary>
        /// Check if a Survey exists
        /// </summary>
        /// <param name="id">The ID of the survey to look for</param>
        bool Exists(int id);
    }
}
