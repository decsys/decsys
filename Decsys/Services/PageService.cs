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
        /// <exception cref="ArgumentOutOfRangeException">If the submitted Page Order is not suitable (i.e. First or Last).</exception>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>
        public Models.Page Create(int id, Models.NewPage page)
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

            var entity = _mapper.Map<Page>(page);

            pages.Insert(page.Order - 1, entity);

            survey.Pages = pages.Select((x, i) => { x.Order = i+1; return x; });

            surveys.Update(survey);

            return _mapper.Map<Models.Page>(entity);
        }

        /// <summary>
        /// Delete a Page from a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to remove the Page from.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>True if the deletion was successful, false if the Survey or Page could not be found.</returns>
        /// <exception cref="ArgumentException">If the page requested to delete is a Welcome or ThankYou page.</exception>
        internal bool Delete(int id, Guid pageId)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id);
            if (survey is null) return false;

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();
            var page = pages.SingleOrDefault(x => x.Id == pageId);
            if (page is null) return false;

            if (new[] { "Welcome", "ThankYou" }.Contains(page.Type))
                throw new ArgumentException(
                    $"The page with {pageId} is a Welcome or ThankYou page and connot be deleted.",
                    nameof(pageId));

            pages.Remove(page);
            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });
            surveys.Update(survey);

            return true;
        }
    }
}
