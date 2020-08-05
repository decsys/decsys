using System;
using System.Collections.Generic;

using Decsys.Models;

namespace Decsys.Repositories.Contracts
{
    public interface IPageRepository
    {
        /// <summary>
        /// Add a Page to a Survey
        /// </summary>
        /// <param name="surveyId"></param>
        Page Create(int surveyId);

        /// <summary>
        /// Find a Page belonging to a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey to search</param>
        /// <param name="pageId">ID of the Page to find</param>
        /// <returns></returns>
        Page Find(int surveyId, Guid pageId);

        /// <summary>
        /// List all Pages in a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        List<Page> List(int surveyId);

        /// <summary>
        /// Replace ALL of a Survey's Pages with the ones provided
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        /// <param name="pages">Pages to replace those currently in the Survey</param>
        void Replace(int surveyId, IEnumerable<Page> pages);

        /// <summary>
        /// Delete a Page from a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        /// <param name="pageId">ID of the Page to delete</param>
        /// <returns></returns>
        public void Delete(int surveyId, Guid pageId);

        /// <summary>
        /// Update a single Page in a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        /// <param name="page">ID of the Page to update</param>
        void Update(int surveyId, Page page);
    }
}
