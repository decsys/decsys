using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Data.Entities;
using LiteDB;

namespace Decsys.Services
{
    /// <summary>
    /// Survey Page functionality
    /// </summary>
    public class PageService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;

        public PageService(LiteDatabase db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        /// <summary>
        /// Create a new Page in a given Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to create the new Page in.</param>
        /// <param name="page">The new Page.</param>
        public void Create(int id, Models.Page page)
        {
            // TODO: temporary restriction
            // check we're not inserting a page before Welcome
            if (page.Order <= 1)
            {
                throw new ArgumentOutOfRangeException(
                   nameof(page.Order),
                   "Page Order must be greater than 1.");
            }

            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException();

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();

            // TODO: temporary restriction
            // check we're not inserting a page after ThankYou
            if (page.Order > pages.Count)
            {
                throw new ArgumentOutOfRangeException(
                   nameof(page.Order),
                   $"Page Order must not be greater than the number of pages ({pages.Count}).");
            }

            pages.Insert(page.Order - 1, _mapper.Map<Page>(page));

            survey.Pages = pages.Select((x, i) => { x.Order = i+1; return x; });

            surveys.Update(survey);
        }
    }
}
