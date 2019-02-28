using AutoMapper;
using Decsys.Data.Entities;
using Decsys.Models;
using LiteDB;

namespace Decsys.Services
{
    public class SurveyWriteService
    {
        private readonly LiteDatabase _db;

        public SurveyWriteService(LiteDatabase db)
        {
            _db = db;
        }

        public Survey Create(string name = null)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var id = surveys.Insert(name is null ? new Survey() : new Survey
            {
                Name = name
            });

            return surveys.FindById(id);
        }
    }
}
