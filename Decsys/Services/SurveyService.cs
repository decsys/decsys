using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Data;
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
            _db.GetCollection<Survey>(Collections.Surveys)
            .FindById(id));

        // TODO: PAGINATE?
        /// <summary>
        /// List summary data for all Surveys.
        /// </summary>
        /// <returns>All surveys summarised.</returns>
        public IEnumerable<Models.SurveySummary> List()
        {
            var summaries = _mapper.Map<IEnumerable<Models.SurveySummary>>(
                _db.GetCollection<Survey>(Collections.Surveys)
                    .FindAll());

            return summaries.Select(survey =>
                _mapper.Map<IEnumerable<SurveyInstance>, Models.SurveySummary>(
                    _db.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                        .Find(instance => instance.Survey.Id == survey.Id),
                    survey));
        }

        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="name">The name to give the new Survey.</param>
        /// <returns>The ID of the newly created Survey.</returns>
        public int Create(string? name = null)
        {
            var pages = new List<Page>
                {
                    // TODO: these are temporary until we have the new configurable pages
                    new Page("Welcome")
                    {
                        Order = 1,
                        Params = new BsonDocument
                        {
                            ["title"] = "Welcome to my Survey",
                            ["body"] = "Please read this interesting information.",
                            ["requireAcceptance"] = false,
                            ["active"] = true
                        }
                    },
                    new Page("ThankYou")
                    {
                        Order = 2,
                        Params = new BsonDocument
                        {
                            ["title"] = "Goodbye to my Survey",
                            ["body"] = "Thanks for playing!",
                            ["active"] = true
                        }
                    }
                };
            return _db.GetCollection<Survey>(Collections.Surveys)
                  .Insert(name is null
                      ? new Survey { Pages = pages }
                      : new Survey
                      {
                          Name = name,
                          Pages = pages
                      });
        }

        /// <summary>
        /// Attempt to delete a Survey by ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to delete.</param>
        public void Delete(int id)
        {
            // TODO: more to delete than just the survey
            // sessions, results data etc...
            _db.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                .Delete(x => x.Survey.Id == id);

            _db.GetCollection<Survey>(Collections.Surveys).Delete(id);
        }

        /// <summary>
        /// Edit the name of a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit.</param>
        /// <param name="name">The new name for the Survey.</param>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>
        public void EditName(int id, string name)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            surveys.Update(survey);
        }
    }
}
