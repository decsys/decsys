using System.Collections.Generic;
using System.Threading.Tasks;

using Decsys.Repositories.Contracts;
using Decsys.Models;

namespace Decsys.Services
{
    /// <summary>
    /// Top level Survey functionality.
    /// </summary>
    public class SurveyService
    {

        private readonly ISurveyRepository _surveys;
        private readonly ImageService _images;

        /// <summary>DI Constructor</summary>
        public SurveyService(ISurveyRepository surveys, ImageService images)
        {
            _surveys = surveys;
            _images = images;
        }

        /// <summary>
        /// Get a Survey by its ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to get.</param>
        /// <returns>The requested Survey, or null if not found.</returns>
        public Survey Get(int id) => _surveys.Find(id);

        // TODO: PAGINATE?
        /// <summary>
        /// List summary data for all Surveys.
        /// </summary>
        /// <returns>All surveys summarised.</returns>
        public IEnumerable<SurveySummary> List() => _surveys.List();


        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="name">The name to give the new Survey.</param>
        /// <returns>The ID of the newly created Survey.</returns>

        public int Create(string? name = null) => _surveys.Create(name);


        /// <summary>
        /// Duplicate a Survey, but not any of its Instance data.
        /// </summary>
        /// <param name="id">The ID of the Survey to use a source.</param>
        /// <returns>The ID of the newly created duplicate Survey.</returns>
        /// <exception cref="KeyNotFoundException">Thrown if a Survey could not be found with the specified ID.</exception>

        public int Duplicate(int id)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            var oldId = survey.Id;

            survey.Name = $"{survey.Name} (Copy)";
            var newId = _surveys.Create(survey);

            _images.CopyAllSurveyFiles(oldId, newId);

            return newId;
        }

        /// <summary>
        /// Import a Survey, including any images
        /// </summary>
        /// <param name="survey">Survey model to import</param>
        /// <param name="images">List of Survey Images to import</param>
        public async Task<int> Import(Survey survey, List<(string filename, byte[] data)> images)
        {
            int id = _surveys.Create(survey);

            if (images.Count > 0)
                await _images.Import(id, images).ConfigureAwait(false);

            return id;
        }

        /// <summary>
        /// Attempt to delete a Survey by ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to delete.</param>
        public void Delete(int id)
        {
            _images.RemoveAllSurveyFiles(id); // delete images on disk for built-in image Page Items
            _surveys.Delete(id);
        }



        /// <summary>
        /// Edit the name of a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit.</param>
        /// <param name="name">The new name for the Survey.</param>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>

        public void EditName(int id, string name) => _surveys.UpdateName(id, name);


        /// <summary>
        /// Configure a Survey for the next Instance run
        /// </summary>
        /// <param name="id">The ID of the Survey to Configure.</param>
        /// <param name="config">A model of configuration values</param>

        public void Configure(int id, ConfigureSurveyModel config)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            survey.OneTimeParticipants = config.OneTimeParticipants;
            survey.UseParticipantIdentifiers = config.UseParticipantIdentifiers;
            survey.ValidIdentifiers = config.ValidIdentifiers;
            _surveys.Update(survey);

        }
    }
}
