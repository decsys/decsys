using System.Collections.Generic;
using System.Linq;
using Decsys.Data;
using Decsys.Repositories.Contracts;
using Decsys.Data.Entities;
using AutoMapper;
using LiteDB;


namespace Decsys.Repositories.LiteDb
{

    public class LiteDbSurveyRepository : ISurveyRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly IMapper _mapper;

        public LiteDbSurveyRepository(LiteDbFactory db, IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _mapper = mapper;
        }

        public bool Exists(int id) =>
            _surveys.Exists(x => x.Id == id);

        public Models.Survey Get(int id) =>
            _mapper.Map<Models.Survey>(
                _surveys.FindById(id));

        public IEnumerable<Models.SurveySummary> List()
        {
            var summaries = _mapper.Map<IEnumerable<Models.SurveySummary>>(
                _db.GetCollection<Data.Entities.Survey>(Collections.Surveys)
                .FindAll());

            return summaries.Select(survey =>
                _mapper.Map(
                    _db.GetCollection<Data.Entities.SurveyInstance>(Collections.SurveyInstances)
                        .Find(instance => instance.Survey.Id == survey.Id),
                    survey));
        }

        public int Create(string? name = null)
        {
            return _db.GetCollection<Data.Entities.Survey>(Collections.Surveys)
                .Insert(name is null
                    ? new Data.Entities.Survey()
                    : new Data.Entities.Survey { Name = name });
        }


        public int Import(Models.Survey survey)
        {
            var surveys = _db.GetCollection<Data.Entities.Survey>(Collections.Surveys);

            survey.Id = 0;
            var id = surveys.Insert(_mapper.Map<Data.Entities.Survey>(survey));

            return id;
        }

        public void Delete(int id)
        {
            _db.GetCollection<Data.Entities.SurveyInstance>(Collections.SurveyInstances)
                .DeleteMany(x => x.Survey.Id == id);

            var surveys = _db.GetCollection<Data.Entities.Survey>(Collections.Surveys);

            surveys.Delete(id);
        }


        public void EditName(int id, string name)
        {
            var surveys = _db.GetCollection<Data.Entities.Survey>(Collections.Surveys);
            var survey = surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            surveys.Update(survey);
        }


        public void Update(Models.Survey survey)
        {
            var surveys = _db.GetCollection<Data.Entities.Survey>(Collections.Surveys);
            Data.Entities.Survey mappedSurvey = _mapper.Map<Data.Entities.Survey>(survey);
            surveys.Update(mappedSurvey);
        }

    }
}
