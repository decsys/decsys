using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Decsys.Models;
using Decsys.Repositories.Contracts;
using Decsys.Services.Contracts;
using LiteDB;

namespace Decsys.Services
{
    /// <summary>
    /// Survey Page functionality
    /// </summary>
    public class PageService
    {
        private readonly IPageRepository _pages;
        private readonly IImageService _images;


        public PageService(IPageRepository pages, IImageService images)
        {
            _pages = pages;
            _images = images;
        }

        /// <summary>
        /// Create a new Page in a given Survey.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey to create the new Page in.</param>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>
        public Page Create(int surveyId) => _pages.Create(surveyId);


        /// <summary>
        /// Move a Page to a new position in the Page Order of a Survey.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey to move a Page in.</param>
        /// <param name="pageId">The ID of the Page to move.</param>
        /// <param name="targetPosition">The new position in the order to put the Page at.</param>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public void Move(int surveyId, Guid pageId, int targetPosition)
        {
            if (targetPosition <= 0) targetPosition = 1; //silently fix this

            var pages = _pages.List(surveyId);

            if (targetPosition > pages.Count) targetPosition = pages.Count; // silently fix this

            var page = pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            if (targetPosition == page.Order) return; // job done ;)

            if (targetPosition > page.Order)
            {
                // moving upwards:
                // 1. Insert the page later
                // 2. Delete the old page
                var i = pages.IndexOf(page);
                pages.Insert(targetPosition, page);
                pages.RemoveAt(i);
            }
            else
            {
                // moving downwards:
                // 1. Delete the old page
                // 2. Insert the page at the new position
                pages.Remove(page);
                pages.Insert(targetPosition - 1, page);
            }

            _pages.Replace(surveyId, pages.Select((x, i) => { x.Order = i + 1; return x; }));
        }

        /// <summary>
        /// Set the name of a Page in a Survey
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to</param>
        /// <param name="pageId">The ID of the Page to set the name of</param>
        /// <param name="name">The name to set</param>
        /// <exception cref="KeyNotFoundException"></exception>
        internal void SetName(int surveyId, Guid pageId, string name)
        {
            var page = _pages.Find(surveyId, pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            page.Name = name;

            _pages.Update(surveyId, page);
        }

        /// <summary>
        /// Delete a Page from a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to remove the Page from.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>True if the deletion was successful, false if the Survey or Page could not be found.</returns>

        public async Task<bool> Delete(int surveyId, Guid pageId)
        {
            try
            {
                var page = _pages.Find(surveyId, pageId);
                if (page is null) return false;

                foreach(var component in page.Components)
                {
                    if (component.Type == "image")
                        await _images.RemoveImage(surveyId, pageId, component.Id);
                }

                _pages.Delete(surveyId, pageId);
                return true;
            }
            catch (KeyNotFoundException)
            {
                return false;
            }
        }

        /// <summary>
        /// Duplicate a Page in a Survey.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey to duplicate the Page in.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <returns>The newly duplicated Page</returns>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>
        public async Task<Page> Duplicate(int surveyId, Guid pageId)
        {
            var pages = _pages.List(surveyId);
            var iPage = pages.FindIndex(x => x.Id == pageId);
            if (iPage < 0) throw new KeyNotFoundException("Page could not be found.");
            var page = pages[iPage];

            // blah manual deep copy time, i guess // TODO Components Repo might ease this?
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

            pages.Insert(iPage + 1, dupe);
            _pages.Replace(surveyId, pages.Select((x, i) => { x.Order = i + 1; return x; }));

            var srcComponents = page.Components.OrderBy(x => x.Order).ToList();
            var destComponents = dupe.Components.OrderBy(x => x.Order).ToList();

            for (var i = 0; i < srcComponents.Count; i++)
            {
                if (srcComponents[i].Type == "image")
                    await _images.CopyImage(surveyId, pageId, srcComponents[i].Id, destComponents[i].Id);
            }

            return dupe;
        }


        /// <summary>
        /// Set whether or not a Survey Page should have its order
        /// randomised with other randomisble siblings, per Participant.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey to duplicate the Page in.</param>
        /// <param name="pageId">The ID of the Page.</param>
        /// <param name="randomize">True or false</param>
        /// <exception cref="KeyNotFoundException">The Page, or Survey, could not be found.</exception>

        public void SetRandomized(int surveyId, Guid pageId, bool randomize)
        {
            var page = _pages.Find(surveyId, pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            page.Randomize = randomize;

            _pages.Update(surveyId, page);
        }
    }
}
