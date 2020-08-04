using System;
using System.Collections.Generic;

using Decsys.Models;

namespace Decsys.Repositories.Contracts
{
    public interface IComponentRepository
    {
        /// <summary>
        /// Create a Component of the specified type on a Page
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page to create the Component on</param>
        /// <param name="type">Type of Component to create</param>
        Component Create(int surveyId, Guid pageId, string type);

        /// <summary>
        /// List all the Components on a Page
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page to list Components of</param>
        List<Component> List(int surveyId, Guid pageId);

        /// <summary>
        /// Replace ALL the Components on a Page with the ones provided
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page to replace Components of</param>
        /// <param name="components">Components to replace those currently on the Page</param>
        void Replace(int surveyId, Guid pageId, IEnumerable<Component> components);

        /// <summary>
        /// Update a Component from the provided model
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page the Component belongs to</param>
        /// <param name="component">Component model to update from</param>
        void Update(int surveyId, Guid pageId, Component component);

        /// <summary>
        /// Find a Component
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page the Component belongs to</param>
        /// <param name="componentId">ID of the Component to find</param>
        Component Find(int surveyId, Guid pageId, Guid componentId);

        /// <summary>
        /// Delete a Component from a Page
        /// </summary>
        /// <param name="surveyId">ID of the Survey the Page belongs to</param>
        /// <param name="pageId">ID of the Page the Component belongs to</param>
        /// <param name="componentId">ID of the Component to delete</param>
        void Delete(int surveyId, Guid pageId, Guid componentId);
    }
}
