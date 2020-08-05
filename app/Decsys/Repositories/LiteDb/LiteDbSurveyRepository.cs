using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;

using LiteDB;


namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyRepository : ISurveyRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly ILiteCollection<SurveyInstance> _instances;
        private readonly IMapper _mapper;

        public LiteDbSurveyRepository(LiteDbFactory db, IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _mapper = mapper;
        }

        public bool Exists(int id) =>
            _surveys.Exists(x => x.Id == id);

        public Models.Survey Find(int id) =>
            _mapper.Map<Models.Survey>(
                _surveys.FindById(id));

        public List<Models.SurveySummary> List()
        {
            var summaries = _mapper.Map<List<Models.SurveySummary>>(
                _surveys.FindAll());

            return summaries.Select(survey =>
                _mapper.Map(
                    _instances.Find(
                        instance => instance.Survey.Id == survey.Id),
                    survey)).ToList();
        }

        public int Create(string? name = null) =>
            _surveys.Insert(
                name is null
                    ? new Survey()
                    : new Survey { Name = name });

        public int Create(Models.Survey survey)
        {
            survey.Id = 0;
            return _surveys.Insert(_mapper.Map<Survey>(survey));
        }

        public void Delete(int id)
        {
            _instances.DeleteMany(x => x.Survey.Id == id);
            _surveys.Delete(id);
        }

        public void UpdateName(int id, string name)
        {
            var survey = _surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            _surveys.Update(survey);
        }

        public void Update(Models.Survey survey) =>
            _surveys.Update(_mapper.Map<Survey>(survey));
    }
}
