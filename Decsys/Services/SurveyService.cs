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
        private readonly ImageService _images;

        /// <summary>DI Constructor</summary>
        public SurveyService(LiteDatabase db, IMapper mapper, ImageService images)
        {
            _db = db;
            _mapper = mapper;
            _images = images;
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
            return _db.GetCollection<Survey>(Collections.Surveys)
                  .Insert(name is null
                      ? new Survey()
                      : new Survey { Name = name });
        }

        /// <summary>
        /// Duplicate a Survey, but not any of its Instance data.
        /// </summary>
        /// <param name="id">The ID of the Survey to use a source.</param>
        /// <returns>The ID of the newly created duplicate Survey.</returns>
        /// <exception cref="KeyNotFoundException">Thrown if a Survey could not be found with the specified ID.</exception>
        public int Duplicate(int id)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);

            var survey = surveys.FindById(id) ?? throw new KeyNotFoundException();
            var oldId = survey.Id;

            survey.Id = 0;
            survey.Name = $"{survey.Name} (Copy)";

            var newId = surveys.Insert(survey);

            _images.CopyAllSurveyFiles(oldId, newId);

            return newId;
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

            var surveys = _db.GetCollection<Survey>(Collections.Surveys);

            // delete images on disk for built-in image Page Items
            _images.RemoveAllSurveyFiles(id);

            surveys.Delete(id);
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

        /// <summary>
        /// Configure a Survey for the next Instance run
        /// </summary>
        /// <param name="id">The ID of the Survey to Configure.</param>
        /// <param name="config">A model of configuration values</param>
        public void Configure(int id, Models.ConfigureSurveyModel config)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.OneTimeParticipants = config.OneTimeParticipants;
            survey.UseParticipantIdentifiers = config.UseParticipantIdentifiers;
            survey.ValidIdentifiers = config.ValidIdentifiers;
            surveys.Update(survey);
        }
    }
}
