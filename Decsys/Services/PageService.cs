using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Data.Entities;
using LiteDB;
using Newtonsoft.Json.Linq;

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

            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });

            surveys.Update(survey);

            return _mapper.Map<Models.Page>(entity);
        }

        /// <summary>
        /// Move a Page to a new position in the Page Order of a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to move a Page in.</param>
        /// <param name="pageId">The ID of the Page to move.</param>
        /// <param name="targetPosition">The new position in the order to put the Page at.</param>
        /// <exception cref="ArgumentOutOfRangeException">If the new requested Page Order is not suitable (i.e. First or Last).</exception>
        /// <exception cref="ArgumentException">If the Page requested to move is a Welcome or ThankYou page (i.e. First or Last).</exception>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public void Move(int id, Guid pageId, int targetPosition)
        {
            // TODO: temporary restriction
            // check we're not inserting a page before Welcome
            if (targetPosition <= 1)
            {
                throw new ArgumentOutOfRangeException(
                   nameof(targetPosition),
                   "New Page Order must be greater than 1.");
            }

            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id);
            if (survey is null) throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();

            // TODO: temporary restriction
            // check we're not inserting a page after ThankYou
            if (targetPosition >= pages.Count)
            {
                throw new ArgumentOutOfRangeException(
                   nameof(targetPosition),
                   $"New Page Order must be less than the number of pages ({pages.Count}).");
            }

            var page = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            if (new[] { "Welcome", "ThankYou" }.Contains(page.Type))
                throw new ArgumentException(
                    $"The page with {pageId} is a Welcome or ThankYou page and connot be moved.",
                    nameof(pageId));

            if (targetPosition == page.Order) return; // job done ;)

            if (targetPosition > page.Order)
            {
                // moving upwards:
                // 1. Insert the page later
                // 2. Delete the old page
                var iPage = pages.IndexOf(page);
                pages.Insert(targetPosition, page);
                pages.RemoveAt(iPage);
            }
            else
            {
                // moving downwards:
                // 1. Delete the old page
                // 2. Insert the page at the new position
                pages.Remove(page);
                pages.Insert(targetPosition - 1, page);
            }

            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });
            surveys.Update(survey);
        }

        /// <summary>
        /// Clear a Parameter of a Page.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit the Page in.</param>
        /// <param name="pageId">The ID of the Page to edit.</param>
        /// <param name="paramKey">The Key of the Parameter value to clear.</param>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        internal void ClearParam(int id, Guid pageId, string paramKey)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();
            var entity = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var page = _mapper.Map<Models.Page>(entity);
            page.Params.Remove(paramKey);

            pages[pages.IndexOf(entity)] = _mapper.Map<Page>(page);

            survey.Pages = pages;
            surveys.Update(survey);
        }

        /// <summary>
        /// Delete a Page from a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to remove the Page from.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>True if the deletion was successful, false if the Survey or Page could not be found.</returns>
        /// <exception cref="ArgumentException">If the page requested to delete is a Welcome or ThankYou page.</exception>
        public bool Delete(int id, Guid pageId)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id);
            if (survey is null) return false;

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();
            var page = pages.SingleOrDefault(x => x.Id == pageId);
            if (page is null) return false;

            // TODO: Temporary, protect Welcome and ThankYou pages
            if (new[] { "Welcome", "ThankYou" }.Contains(page.Type))
                throw new ArgumentException(
                    $"The page with {pageId} is a Welcome or ThankYou page and connot be deleted.",
                    nameof(pageId));

            pages.Remove(page);
            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });
            surveys.Update(survey);

            return true;
        }

        /// <summary>
        /// Merge new Params into the Page's current Params property.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit the Page in.</param>
        /// <param name="pageId">The ID of the Page to edit.</param>
        /// <param name="pageParams">The Params object to merge.</param>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public void MergeParams(int id, Guid pageId, JObject pageParams)
        {
            var surveys = _db.GetCollection<Survey>("Surveys");
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();
            var entity = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var page = _mapper.Map<Models.Page>(entity);
            page.Params.Merge(pageParams);

            pages[pages.IndexOf(entity)] = _mapper.Map<Page>(page);

            survey.Pages = pages;
            surveys.Update(survey);
        }
    }
}
