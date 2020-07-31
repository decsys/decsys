using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Decsys.Models;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Services;
using AutoMapper;
using LiteDB;
using Newtonsoft.Json.Linq;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbComponentRepository 
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;
        private readonly ImageService _images;
        public LiteDbComponentRepository(LiteDbFactory db, IMapper mapper, ImageService images)
        {
            _db = db.Surveys;
            _mapper = mapper;
            _images = images;
        }

    }
}
