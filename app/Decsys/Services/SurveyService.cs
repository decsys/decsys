using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Repositories.LiteDb;
using LiteDB;

namespace Decsys.Services
{
    /// <summary>
    /// Top level Survey functionality.
    /// </summary>
    public class SurveyService
    {
 
        private readonly ISurveyRepository _surveys;
        private readonly IMapper _mapper;
        private readonly ImageService _images;

        /// <summary>DI Constructor</summary>
        public SurveyService(ISurveyRepository surveys, IMapper mapper, ImageService images)
        {
            _surveys = surveys;
            _mapper = mapper;
            _images = images;
        }

        public Models.Survey Get(int id) => _surveys.Get(id);

        public IEnumerable<Models.SurveySummary> List()
        {
            return _surveys.List();
        }

       
        public int Create(string? name = null)
        {
            return _surveys.Create(name);
        }


        public int Duplicate(int id)
        {
            var survey = _surveys.Get(id) ?? throw new KeyNotFoundException();
            var oldId = survey.Id;

            survey.Id = 0;
            survey.Name = $"{survey.Name} (Copy)";

            var newId = _surveys.Create(survey.Name);

            _images.CopyAllSurveyFiles(oldId , newId);

            return newId;
        }


        public async Task<int> Import(Models.Survey survey, List<(string filename, byte[] data)> images)
        {

            var surveys = _db.GetCollection<Survey>(Collections.Surveys); //Done repo side?

            survey.Id = 0; // Done service side?
            var id = surveys.Insert(_mapper.Map<Survey>(survey)); //What does _mapper do?



            if (images.Count > 0) //Service side?
                await _images.Import(id, images).ConfigureAwait(false);

            return id;
        }

        public void Delete(int id)
        {
            _surveys.Delete(id);
        }


        public void EditName(int id, string name)
        {
            _surveys.EditName(id, name);
        }

        public void Configure(int id, Models.ConfigureSurveyModel config)
        {

            var survey = _surveys.Get(id) ?? throw new KeyNotFoundException();
            survey.OneTimeParticipants = config.OneTimeParticipants;
            survey.UseParticipantIdentifiers = config.UseParticipantIdentifiers;
            survey.ValidIdentifiers = config.ValidIdentifiers;
            //Do I need to write Update method in repo? -> or would the configure method take suvery Model as a paramter? 
            surveys.Update(survey);
        }
    }
}
