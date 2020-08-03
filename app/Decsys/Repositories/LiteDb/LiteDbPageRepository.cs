
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

using AutoMapper;

using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;

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
                Order = survey.Pages.Count()
            };

            survey.Pages = survey.Pages.Append(page);
            _surveys.Update(survey);

            return _mapper.Map<Models.Page>(page);
        }

        public List<Models.Page> List(int surveyId)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            return _mapper.Map<IList<Models.Page>>(survey.Pages);
        }

        public void Replace(int surveyId, IEnumerable<Models.Page> pages)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();
            survey.Pages = _mapper.Map<IEnumerable<Page>>(pages);
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

            var pages = survey.Pages.ToList();
            var page = pages.Find(x => x.Id == pageId) ?? throw new KeyNotFoundException();
            pages.Remove(page);

            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });
            _surveys.Update(survey);
        }

        public void Update(int surveyId, Models.Page page)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException();

            var pages = survey.Pages.ToList();
            var iPage = pages.FindIndex(x => x.Id == page.Id);
            if (iPage < 0) throw new KeyNotFoundException();

            pages[iPage] = _mapper.Map<Page>(page);
            survey.Pages = pages;
            _surveys.Update(survey);
        }
    }
}
