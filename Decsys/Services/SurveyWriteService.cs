using AutoMapper;
using Decsys.Data.Entities;
using Decsys.Models;
using LiteDB;

namespace Decsys.Services
{
    public class SurveyWriteService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;

        public SurveyWriteService(LiteDatabase db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public SurveySummary Create(string name = null)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var id = surveys.Insert(name is null ? new Survey() : new Survey
            {
                Name = name
            });

            return _mapper.Map<SurveySummary>(surveys.FindById(id));
        }
    }
}
