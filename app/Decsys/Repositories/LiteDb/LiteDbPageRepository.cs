using System;
using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;
using Decsys.Utilities;

using LiteDB;


namespace Decsys.Repositories.LiteDb
{
    public class LiteDbPageRepository : IPageRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly IMapper _mapper;

        public LiteDbPageRepository(LiteDbFactory db, IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _mapper = mapper;
        }

        public Models.Page Create(int surveyId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();

            var page = new Page()
            {
                Order = survey.Pages.Count + 1,
                Name = $"Page {BaseConvert.ToBijectiveHexavigesimal(survey.PageCreationCounter++)}"
            };

            survey.Pages.Add(page);
            _surveys.Update(survey);

            return _mapper.Map<Models.Page>(page);
        }

        public List<Models.Page> List(int surveyId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            return _mapper.Map<List<Models.Page>>(survey.Pages);
        }

        public void Replace(int surveyId, IEnumerable<Models.Page> pages)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            survey.Pages = _mapper.Map<List<Page>>(pages);
            _surveys.Update(survey);
        }

        public Models.Page Find(int surveyId, Guid pageId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            return _mapper.Map<Models.Page>(
                survey.Pages.SingleOrDefault(x => x.Id == pageId));
        }

        public void Delete(int surveyId, Guid pageId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();
            survey.Pages.Remove(page);

            survey.Pages = survey.Pages.Select((x, i) => { x.Order = i + 1; return x; }).ToList();

            // If we just deleted the last page, it's ok to reset the naming counter
            if (survey.Pages.Count == 0) survey.PageCreationCounter = 0;

            _surveys.Update(survey);
        }

        public void Update(int surveyId, Models.Page page)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();

            var iPage = survey.Pages.FindIndex(x => x.Id == page.Id);
            if (iPage < 0) throw new KeyNotFoundException();

            survey.Pages[iPage] = _mapper.Map<Page>(page);
            _surveys.Update(survey);
        }
    }
}
