using System;
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
    public class LiteDbComponentRepository : IComponentRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly Mapper _mapper;

        public LiteDbComponentRepository(LiteDbFactory db, Mapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _mapper = mapper;
        }

        public Models.Component Create(int surveyId, Guid pageId, string type)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.FirstOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();

            var component = new Component(type)
            {
                Order = page.Components.Count
            };

            page.Components.Add(new Component(type));

            _surveys.Update(survey);
            return _mapper.Map<Models.Component>(component);
        }

        public List<Models.Component> List(int surveyId, Guid pageId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId) ?? throw new KeyNotFoundException();
            return _mapper.Map<List<Models.Component>>(page.Components);
        }

        public void Replace(int surveyId, Guid pageId, IEnumerable<Models.Component> components)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.FirstOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();

            page.Components = _mapper.Map<List<Component>>(components);

            _surveys.Update(survey);
        }

        public void Update(int surveyId, Guid pageId, Models.Component component)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.FirstOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();

            var i = page.Components.FindIndex(x => x.Id == component.Id);
            if (i < 0) throw new KeyNotFoundException();

            page.Components[i] = _mapper.Map<Component>(component);
            _surveys.Update(survey);
        }

        public Models.Component Find(int surveyId, Guid pageId, Guid componentId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId) ?? throw new KeyNotFoundException();
            return _mapper.Map<Models.Component>(
                page.Components.SingleOrDefault(x => x.Id == componentId));
        }

        public void Delete(int surveyId, Guid pageId, Guid componentId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();

            var component = page.Components.FirstOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException();
            page.Components.Remove(component);

            page.Components = page.Components.Select((x, i) => { x.Order = i + 1; return x; }).ToList();
            _surveys.Update(survey);
        }
    }
}
