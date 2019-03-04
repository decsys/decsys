using System.Collections.Generic;
using Decsys.Data.Entities;
using LiteDB;

namespace Decsys.Services
{
    public class SurveyService
    {
        private readonly LiteDatabase _db;

        public SurveyService(LiteDatabase db)
        {
            _db = db;
        }

        /// <summary>
        /// Get a Survey by its ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to get.</param>
        /// <returns>The requested Survey, or null if not found.</returns>
        public Survey Get(int id) => _db.GetCollection<Survey>("Surveys").FindById(id);

        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="name">The name to give the new Survey.</param>
        /// <returns>The ID of the newly created Survey.</returns>
        public int Create(string name = null)
            => _db.GetCollection<Survey>("Surveys")
                .Insert(name is null ? new Survey() : new Survey
                {
                    Name = name
                });

        /// <summary>
        /// Edit the name of a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit.</param>
        /// <param name="name">The new name for the Survey.</param>
        public void EditName(int id, string name)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            surveys.Update(survey);
        }
    }
}
