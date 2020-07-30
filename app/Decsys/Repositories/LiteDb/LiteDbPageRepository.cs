using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Decsys.Models;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Repositories.LiteDb;
using Decsys.Services;
using AutoMapper;
using LiteDB;


namespace Decsys.Repositories.LiteDb
{
    public class LiteDbPageRepository : IPageRepository
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;
        private readonly ImageService _images;
        public LiteDbPageRepository(LiteDbFactory db, IMapper mapper, ImageService images)
        {
            _db = db.Surveys;
            _mapper = mapper;
            _images = images;
      
        }

        public Data.Entities.Survey Get(int id) =>
            _db.GetCollection<Data.Entities.Survey>(Collections.Surveys).FindById(id);


        public void Update(Data.Entities.Survey survey) 
        {
            var surveys = _db.GetCollection<Data.Entities.Survey>(Collections.Surveys);

            surveys.Update(survey);
        }

        
    }
}
