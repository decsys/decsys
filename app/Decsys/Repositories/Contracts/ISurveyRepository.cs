using Decsys.Data.Entities;
using Decsys.Models;
using Decsys.Models.Results;
using System.Collections.Generic;

namespace Decsys.Repositories.Contracts
{
    public interface ISurveyRepository
    {
        /// <summary>
        /// Find a Survey
        /// </summary>
        /// <param name="id">The ID of the Survey to find</param>
        Survey Find(int id);

        /// <summary>
        /// List Summaries of all Surveys,
        /// or all Surveys accessible by the specified user, if any.
        /// </summary>
        /// <param name="userId">Optional User ID</param>
        /// <param name="includeOwnerless">
        /// Even if a User ID is specified, still additionally include Surveys with no Owner
        /// </param>
        List<SurveySummary> List(string? userId = null, bool includeOwnerless = false);

        /// <summary>
        /// Create a new empty Survey, optionally belonging to a specific user.
        /// </summary>
        /// <param name="model">Survey creation details</param>
        /// <param name="ownerId">Optional Owner ID</param>
        int Create(CreateSurveyModel model, string? ownerId = null);

        /// <summary>
        /// Create a new Survey from a provided model
        /// </summary>
        /// <param name="survey">Survey model to import</param>
        /// <param name="model">New Survey creation details</param>
        /// <param name="ownerId">Optional Owner ID</param>
        int Create(Survey survey, CreateSurveyModel model, string? ownerId = null);

        /// <summary>
        /// Delete a Survey
        /// </summary>
        /// <param name="id">ID of the Survey to delete</param>
        void Delete(int id);

        /// <summary>
        /// Update the name of a Survey
        /// </summary>
        /// <param name="id">ID of the Survey</param>
        /// <param name="name">New name</param>
        void UpdateName(int id, string name);

        /// <summary>
        /// Generally update a Survey from the provided model
        /// </summary>
        /// <param name="survey">Survey model to update from</param>
        void Update(Survey survey);

        /// <summary>
        /// Check if a Survey exists,
        /// and is accessible by the specified user, if any.
        /// </summary>
        /// <param name="id">The ID of the survey to look for</param>
        bool Exists(int id);

        /// <summary>
        /// Test whether a user has access to a given survey.
        /// </summary>
        /// <param name="id">ID of the Survey to test access to</param>
        /// <param name="userId">ID of the User to test access for</param>
        /// <param name="allowOwnerless">Treat Surveys with no Owner as owned by the specified User</param>
        /// <returns></returns>
        SurveyAccessResult TestSurveyAccess(int id, string userId, bool allowOwnerless = false);


        /// <summary>
        /// Get the ExternalLookup record for a given key name and value
        /// </summary>
        /// <param name="externalKey"></param>
        /// <param name="externalId"></param>
        /// <returns></returns>
        // Entity return is safe as it's not data layer dependent :)
        // if it becomes such, a DTO (model) will be needed
        public ExternalLookup LookupExternal(string externalKey, string externalId);
    }
}
