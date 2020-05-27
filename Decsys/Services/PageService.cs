using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Data;
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
        private readonly ImageService _images;

        public PageService(LiteDbFactory db, IMapper mapper, ImageService images)
        {
            _db = db.Surveys;
            _mapper = mapper;
            _images = images;
        }

        /// <summary>
        /// Create a new Page in a given Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to create the new Page in.</param>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>
        public Models.Page Create(int id)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException();

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();

            var entity = _mapper.Map<Page>(new Page());

            pages.Add(entity);

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
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public void Move(int id, Guid pageId, int targetPosition)
        {
            if (targetPosition <= 0) targetPosition = 1; //silently fix this

            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id);
            if (survey is null) throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();

            if (targetPosition > pages.Count()) targetPosition = pages.Count(); // silently fix this

            var page = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

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
        /// Delete a Page from a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to remove the Page from.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>True if the deletion was successful, false if the Survey or Page could not be found.</returns>
        public bool Delete(int id, Guid pageId)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id);
            if (survey is null) return false;

            var pages = survey.Pages.OrderBy(x => x.Order).ToList();
            var page = pages.SingleOrDefault(x => x.Id == pageId);
            if (page is null) return false;

            page.Components.ToList().ForEach(component =>
            {
                if (component.Type == "image")
                    _images.RemoveFile(id, pageId, component.Id);
            });

            pages.Remove(page);
            survey.Pages = pages.Select((x, i) => { x.Order = i + 1; return x; });
            surveys.Update(survey);

            return true;
        }

        /// <summary>
        /// Duplicate a Page in a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to duplicate the Page in.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>The newly duplicated Page</returns>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public Models.Page Duplicate(int id, Guid pageId)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.ToList();
            var page = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            // blah manual deep copy time, i guess
            var components = page.Components.Select(x => new Component(x.Type)
            {
                Id = Guid.NewGuid(),
                Order = x.Order,
                Params = x.Params
            }).ToList();
            var dupe = new Page
            {
                Id = Guid.NewGuid(),
                Order = pages.Count + 1,
                Components = components,
                Randomize = page.Randomize
            };
            pages.Add(dupe);

            survey.Pages = pages;
            surveys.Update(survey);

            var srcComponents = page.Components.OrderBy(x => x.Order).ToList();
            var destComponents = dupe.Components.OrderBy(x => x.Order).ToList();

            for (var i = 0; i < srcComponents.Count; i++)
            {
                if (srcComponents[i].Type == "image")
                    _images.CopyFile(id, pageId, srcComponents[i].Id, destComponents[i].Id);
            }

            return _mapper.Map<Models.Page>(dupe);
        }

        /// <summary>
        /// Set whether or not a Survey Page should have its order
        /// randomised with other randomisble siblings, per Participant.
        /// </summary>
        /// <param name="id">The ID of the Survey to duplicate the Page in.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <param name="randomize">True or false</param>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public void SetRandomized(int id, Guid pageId, bool randomize)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var pages = survey.Pages.ToList();
            var page = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            page.Randomize = randomize;
            pages = pages.Select(x => x.Id == page.Id ? page : x).ToList();

            survey.Pages = pages;
            surveys.Update(survey);
        }
    }
}
