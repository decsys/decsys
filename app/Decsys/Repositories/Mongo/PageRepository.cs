using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo
{
    public class PageRepository : IPageRepository
    {
        private readonly IMongoCollection<Survey> _surveys;
        private readonly IMapper _mapper;

        public PageRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IMapper mapper)
        {
            _surveys = mongo.GetDatabase(config.Value.DatabaseName)
                .GetCollection<Survey>(Collections.Surveys);
            _mapper = mapper;
        }

        public Models.Page Create(int surveyId)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();

            var page = new Page()
            {
                Order = survey.Pages.Count + 1
            };

            survey.Pages.Add(page);
            _surveys.ReplaceOne(x => x.Id == surveyId, survey);

            return _mapper.Map<Models.Page>(page);
        }

        public void Delete(int surveyId, Guid pageId)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException();
            survey.Pages.Remove(page);

            survey.Pages = survey.Pages.Select((x, i) => { x.Order = i + 1; return x; }).ToList();
            _surveys.ReplaceOne(x => x.Id == surveyId, survey);
        }

        public Models.Page Find(int surveyId, Guid pageId)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();
            return _mapper.Map<Models.Page>(survey.Pages.SingleOrDefault(x => x.Id == pageId));
        }

        public List<Models.Page> List(int surveyId)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();
            return _mapper.Map<List<Models.Page>>(survey.Pages);
        }

        public void Replace(int surveyId, IEnumerable<Models.Page> pages)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();
            survey.Pages = _mapper.Map<List<Page>>(pages);
            _surveys.ReplaceOne(x => x.Id == surveyId, survey);
        }

        public void Update(int surveyId, Models.Page page)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault()
                ?? throw new KeyNotFoundException();

            var iPage = survey.Pages.FindIndex(x => x.Id == page.Id);
            if (iPage < 0) throw new KeyNotFoundException();

            survey.Pages[iPage] = _mapper.Map<Page>(page);
            _surveys.ReplaceOne(x => x.Id == surveyId, survey);
        }
    }
}
