
using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;
using Decsys.Services;

using LiteDB;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbComponentRepository : IComponentRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly IMapper _mapper;
        private readonly ComponentFileService _componentFiles;

        public LiteDbComponentRepository(
            LiteDbFactory db,
            IMapper mapper,
            ComponentFileService componentFiles)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _mapper = mapper;
            _componentFiles = componentFiles;
        }

        public Models.Component Create(int surveyId, Guid pageId, string type)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            var page = survey.Pages.FirstOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();

            var component = new Component(type)
            {
                Order = page.Components.Count + 1,
                // If this isn't a response item
                // and there are no components on the page already (except response items)
                // then this is a Question Item
                IsQuestionItem = !_componentFiles.IsResponseItem(type) &&
                    !page.Components.Any(x => !_componentFiles.IsResponseItem(x.Type))
            };

            page.Components.Add(component);
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
