using System;
using System.Collections.Generic;
using System.Linq;

using Decsys.Repositories.Contracts;
using Decsys.Models;

using LiteDB;

using Newtonsoft.Json.Linq;

namespace Decsys.Services
{
    /// <summary>
    /// Survey Page functionality
    /// </summary>
    public class ComponentService
    {
        private readonly IComponentRepository _components;
        private readonly ISurveyRepository _surveys;
        private readonly LocalFileImageService _images;

        public ComponentService(IComponentRepository components, ISurveyRepository surveys, LocalFileImageService images)
        {
            _components = components;
            _surveys = surveys;
            _images = images;
        }

        /// <summary>
        /// Create a new Component in a given Survey Page.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page to create the new Component in.</param>
        /// <param name="type">The type of the new Component.</param>
        /// <exception cref="KeyNotFoundException">If the Survey or Page cannot be found.</exception>
        public Component Create(int surveyId, Guid pageId, string type) =>
            _components.Create(surveyId, pageId, type);

        /// <summary>
        /// Move a Component to a new position in the Component Order of a Page.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page the Component belongs to.</param>
        /// <param name="componentId">The ID of the Component to move.</param>
        /// <param name="targetPosition">The new position in the order to put the Component at.</param>
        /// <exception cref="KeyNotFoundException">The Component, Page, or Survey, could not be found.</exception>
        public void Move(int surveyId, Guid pageId, Guid componentId, int targetPosition)
        {
            if (targetPosition <= 0) targetPosition = 1; //silently fix this

            var components = _components.List(surveyId, pageId);

            if (targetPosition > components.Count) targetPosition = components.Count; // silently fix this

            var component = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            if (targetPosition == component.Order) return; // job done ;)

            if (targetPosition > component.Order)
            {
                // moving upwards:
                // 1. Insert the component later
                // 2. Delete the old component
                var i = components.IndexOf(component);
                components.Insert(targetPosition, component);
                components.RemoveAt(i);
            }
            else
            {
                // moving downwards:
                // 1. Delete the old component
                // 2. Insert the page at the new position
                components.Remove(component);
                components.Insert(targetPosition - 1, component);
            }

            _components.Replace(surveyId, pageId,
                components.Select((x, i) => { x.Order = i + 1; return x; }));
        }

        /// <summary>
        /// Clear a Parameter of a Component.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page the Component belongs to.</param>
        /// <param name="componentId">The ID of the Component to edit.</param>
        /// <param name="paramKey">The Key of the Parameter value to clear.</param>
        /// <exception cref="KeyNotFoundException">The Component, Page, or Survey, could not be found.</exception>
        internal void ClearParam(int surveyId, Guid pageId, Guid componentId, string paramKey)
        {
            var components = _components.List(surveyId, pageId);
            var component = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            component.Params.Remove(paramKey);
            _components.Update(surveyId, pageId, component);
        }

        /// <summary>
        /// Delete a Page from a Survey.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page to delete the Component from.</param>
        /// <param name="componentId">The ID of the Component.</param>
        /// <returns>True if the deletion was successful, false if the Survey, Page or Component could not be found.</returns>
        public bool Delete(int surveyId, Guid pageId, Guid componentId)
        {
            try
            {
                var component = _components.Find(surveyId, pageId, componentId);
                if (component is null) return false;

                if (component.Type == "image")
                    _images.RemoveFile(surveyId, pageId, componentId);

                _components.Delete(surveyId, pageId, componentId);

                return true;
            }
            catch (KeyNotFoundException)
            {
                return false;
            }
        }

        /// <summary>
        /// Merge new Params into the Components's current Params property.
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page to edit the Component in.</param>
        /// <param name="componentId">The ID of the Component to edit.</param>
        /// <param name="componentParams">The Params object to merge.</param>
        /// <exception cref="KeyNotFoundException">The Component, Page, or Survey, could not be found.</exception>
        public void MergeParams(int surveyId, Guid pageId, Guid componentId, JObject componentParams)
        {
            var components = _components.List(surveyId, pageId);
            var component = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            component.Params.Merge(componentParams);
            _components.Update(surveyId, pageId, component);
        }


        /// <summary>
        /// Duplicate a component in a Page
        /// </summary>
        /// <param name="surveyId">The ID of the Survey the Page belongs to.</param>
        /// <param name="pageId">The ID of the Page to duplicate the Component in.</param>
        /// <param name="componentId">The ID of the Component to duplicate.</param>
        /// <exception cref="KeyNotFoundException">The Component, Page, or Survey, could not be found.</exception>
        public Component Duplicate(int surveyId, Guid pageId, Guid componentId)
        {
            var components = _components.List(surveyId, pageId);

            var i = components.FindIndex(x => x.Id == componentId);
            if (i < 0) throw new KeyNotFoundException("Component could not be found.");
            var component = components[i];

            // manual deep copy
            var dupe = new Component(component.Type)
            {
                Order = components.Count + 1,
                Params = component.Params
            };
            components.Insert(i + 1, dupe);

            _images.CopyFile(surveyId, pageId, componentId, dupe.Id);

            _components.Replace(surveyId, pageId, components.Select((x, i) => { x.Order = i + 1; return x; }));

            return dupe;
        }
    }
}
