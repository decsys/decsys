using System.Collections.Generic;
using AutoMapper;
using Decsys.Data.Entities;
using LiteDB;

namespace Decsys.Services
{
    /// <summary>
    /// Top level Survey functionality.
    /// </summary>
    public class SurveyService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;

        /// <summary>DI Constructor</summary>
        public SurveyService(LiteDatabase db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        /// <summary>
        /// Get a Survey by its ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to get.</param>
        /// <returns>The requested Survey, or null if not found.</returns>
        public Models.Survey Get(int id) => _mapper.Map<Models.Survey>(
            _db.GetCollection<Survey>("Surveys")
            .FindById(id));

        // TODO: PAGINATE
        /// <summary>
        /// List summary data for all Surveys.
        /// </summary>
        /// <returns>All surveys summarised.</returns>
        public IEnumerable<Models.SurveySummary> List() =>
            _mapper.Map<IEnumerable<Models.SurveySummary>>(
                _db.GetCollection<Survey>("Surveys")
                .FindAll());

        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="name">The name to give the new Survey.</param>
        /// <returns>The ID of the newly created Survey.</returns>
        public int Create(string name = null)
            => _db.GetCollection<Survey>("Surveys")
                .Insert(name is null ? new Survey() : new Survey
                {
                    Name = name,
                    Pages = new List<Page>
                    {
                        // TODO: these are temporary until we have the new configurable pages
                        new Page
                        {
                            Order = 1,
                            Type = "Welcome",
                            Params = new BsonDocument
                            {
                                ["title"] = "Welcome to my Survey",
                                ["body"] = "Please read this interesting information.",
                                ["requireAcceptance"] = false,
                                ["active"] = true
                            }
                        },
                        new Page
                        {
                            Order = 2,
                            Type = "ThankYou",
                            Params = new BsonDocument
                            {
                                ["title"] = "Goodbye to my Survey",
                                ["body"] = "Thanks for playing!",
                                ["active"] = true
                            }
                        }
                    }
                });

        /// <summary>
        /// Attempt to delete a Survey by ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to delete.</param>
        /// <returns>True if the deletion was successful, or false if the record was not found.</returns>
        public bool Delete(int id)
            => _db.GetCollection<Survey>("Surveys").Delete(id);

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
