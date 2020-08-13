using System;
using System.Collections.Generic;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo
{
    public class ComponentRepository : IComponentRepository
    {
        private readonly IMongoCollection<Survey> _surveys;

        public ComponentRepository(
            IConfiguration config,
            IMongoClient db)
        {
            // TODO: Document this
            _surveys = db.GetDatabase(config["Hosted:DatabaseName"] ?? "decsys")
                .GetCollection<Survey>(Collections.Surveys);
        }

        public Models.Component Create(int surveyId, Guid pageId, string type)
        {
            throw new NotImplementedException();
        }

        public void Delete(int surveyId, Guid pageId, Guid componentId)
        {
            throw new NotImplementedException();
        }

        public Models.Component Find(int surveyId, Guid pageId, Guid componentId)
        {
            throw new NotImplementedException();
        }

        public List<Models.Component> List(int surveyId, Guid pageId)
        {
            throw new NotImplementedException();
        }

        public void Replace(int surveyId, Guid pageId, IEnumerable<Models.Component> components)
        {
            throw new NotImplementedException();
        }

        public void Update(int surveyId, Guid pageId, Models.Component component)
        {
            throw new NotImplementedException();
        }
    }
}
