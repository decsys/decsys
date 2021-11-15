using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Decsys.Config;
using Decsys.Models;
using Decsys.Repositories.Contracts;
using Decsys.Services.Contracts;

using Microsoft.Extensions.Options;

using Newtonsoft.Json.Linq;

namespace Decsys.Services
{
    /// <summary>
    /// Top level Survey functionality.
    /// </summary>
    public class SurveyService
    {
        private readonly ISurveyRepository _surveys;
        private readonly IImageService _images;
        private readonly ISurveyInstanceRepository _instances;
        private readonly IOptionsSnapshot<ComponentTypeMap> _componentTypeMaps;

        /// <summary>DI Constructor</summary>
        public SurveyService(
            ISurveyRepository surveys,
            IImageService images,
            ISurveyInstanceRepository instances,
            IOptionsSnapshot<ComponentTypeMap> componentTypeMaps)
        {
            _surveys = surveys;
            _images = images;
            _instances = instances;
            _componentTypeMaps = componentTypeMaps;
        }

        public ExternalLookupDetails LookupExternal(JObject model, int? surveyId)
        {
            string? lookupKey = null;
            string? lookupValue = null;

            if(surveyId.HasValue)
            {
                lookupValue = surveyId.Value.ToString();
            } else if (model.ContainsKey("STUDY_ID"))
            {
                // this is pretty hardcoded to the Legacy Prolific access right now
                // Any extension of it would warrant a small refactor to eliminate magic strings etc.
                lookupKey = "STUDY_ID";
                lookupValue = (string?)model[lookupKey];
            }

            if(lookupValue is not null)
            {
                var lookup = _surveys.LookupExternal(lookupKey, lookupValue);

                if (lookup is null)
                    throw new KeyNotFoundException(
                        $"Couldn't find a Survey using the Id key/value: {lookupKey ?? "Internal Survey ID"}={lookupValue}");

                ExternalLookupDetails details = new()
                {
                    SurveyId = lookup.SurveyId,
                    InstanceId = lookup.InstanceId
                };

                if (!string.IsNullOrWhiteSpace(lookup.ParticipantIdKey) && model.ContainsKey(lookup.ParticipantIdKey))
                {
                    details.ParticipantId = (string?)model[lookup.ParticipantIdKey];
                }

                return details;
            }

            throw new ArgumentException("No valid parameter for Survey ID was found.");
        }

        /// <summary>
        /// Get a Survey by its ID.
        /// </summary>
        /// <param name="id">The ID of the Survey to get.</param>
        /// <returns>The requested Survey, or null if not found.</returns>
        public Survey Get(int id) => _surveys.Find(id);

        // TODO: PAGINATE?
        /// <summary>
        /// List summary data for all Surveys.
        /// </summary>
        /// <param name="userId">Optional Owner of the new Survey</param>
        /// <param name="includeOwnerless">
        /// Even if a User ID is specified, still additionally include Surveys with no Owner
        /// </param>
        /// <returns>All surveys summarised.</returns>
        public IEnumerable<SurveySummary> List(string? userId = null, bool includeOwnerless = false)
            => _surveys.List(userId, includeOwnerless);

        /// <summary>
        /// List summary data for all children of a Survey
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public IEnumerable<SurveySummary> ListChildren(int parentId)
            => _surveys.ListChildren(parentId);

        /// <summary>
        /// Creates a Survey with the provided name (or the default one).
        /// </summary>
        /// <param name="model">The model of options to create the new Survey.</param>
        /// <param name="ownerId">Optional Owner of the new Survey</param>
        /// <returns>The ID of the newly created Survey.</returns>
        public int Create(CreateSurveyModel model, string? ownerId = null)
            => _surveys.Create(model, ownerId);


        /// <summary>
        /// Duplicate a Survey, but not any of its Instance data.
        /// </summary>
        /// <param name="id">The ID of the Survey to use a source.</param>
        /// <param name="model">The model of options to create the new Survey.</param>
        /// <returns>The ID of the newly created duplicate Survey.</returns>
        /// <exception cref="KeyNotFoundException">Thrown if a Survey could not be found with the specified ID.</exception>

        public async Task<int> Duplicate(int id, CreateSurveyModel model, string? ownerId = null)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            var oldId = survey.Id;

            survey.Name = model.Name ?? $"{survey.Name} (Copy)";

            if (survey.Parent is not null)
            {
                // if it's a child, but it/its study are locked,
                // then we can't duplicate inside the study; we have to clear the parent
                if (_instances.List(oldId).Count > 0)
                {
                    survey.Parent = null;
                    model.ParentSurveyId = null;
                }
                else
                {
                    // align these for duplication purposes, allowing us to short circuit fetching the parent
                    model.ParentSurveyId = survey.Parent.Id;
                }
            }

            var newId = _surveys.Create(survey, model, ownerId);

            if (survey.IsStudy)
            {
                var study = _surveys.Find(newId);
                foreach (var child in _surveys.ListChildren(oldId))
                {
                    var childSurvey = _surveys.Find(child.Id);

                    childSurvey.Parent = study;

                    var newChildId = _surveys.Create(
                        childSurvey,
                        new()
                        {
                            Name = childSurvey.Name,
                            Type = childSurvey.Type,
                            IsStudy = false,
                            ParentSurveyId = study.Id,
                            Settings = childSurvey.Settings
                        },
                        ownerId);
                    await _images.CopyAllSurveyImages(child.Id, newChildId);
                }
            }
            else
            {
                await _images.CopyAllSurveyImages(oldId, newId);
            }

            return newId;
        }

        /// <summary>
        /// Import a Survey, including any images
        /// </summary>
        /// <param name="survey">Survey model to import</param>
        /// <param name="images">List of Survey Images to import</param>
        /// <param name="model">The model of options to create the new Survey.</param>
        /// <param name="newOwnerId">ID of the User doing the import</param>
        public async Task<int> Import(
            Survey survey,
            List<(string filename, byte[] data)> images,
            CreateSurveyModel model,
            string? newOwnerId = null)
        {
            // any validation, or mapping to account for version changes
            MigrateUpComponentTypes(ref survey);

            int id = _surveys.Create(survey, model, newOwnerId);

            if (images.Count > 0)
                await _images.Import(id, images).ConfigureAwait(false);

            return id;
        }

        public void SetParent(int id, int? parentId)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            if (survey.IsStudy)
                throw new ArgumentException(
                    $"The specified survey {id} is a Study and therefore cannot have a parent.", nameof(id));

            Survey? parent = null;
            if (parentId is not null)
            {
                parent = _surveys.Find(parentId.Value) ?? throw new KeyNotFoundException();
                if (!parent.IsStudy)
                    throw new ArgumentException(
                        $"The specified parent {parentId} is not a Study and therefore cannot have children.", nameof(parentId));
            }

            survey.Parent = parent;
            _surveys.Update(survey);
        }

        private void MigrateUpComponentTypes(ref Survey survey)
        {
            // this is very simplistic right now from 1.x to 2.x
            // but in future there may be complex version based migration
            var v1map = _componentTypeMaps.Get(Versions.v1).Types;
            var v2map = _componentTypeMaps.Get(Versions.v2).Types;
            foreach (var page in survey.Pages)
            {
                foreach (var component in page.Components)
                {
                    if (v1map.ContainsValue(component.Type))
                    {
                        var key = v1map.Single(item => item.Value == component.Type).Key;
                        component.Type = v2map[key];
                    }
                }
            }
        }

        /// <summary>
        /// Attempt to delete a Survey by ID.
        /// Deleting Studies will also delete all child surveys.
        /// </summary>
        /// <param name="id">The ID of the Survey to delete.</param>
        public async Task Delete(int id)
        {
            List<int> toDelete = new() { id };

            // Studies need to delete children too
            var children = _surveys.ListChildren(id);
            toDelete.AddRange(children.Select(x => x.Id));

            foreach (var surveyId in toDelete)
            {
                await _images.RemoveAllSurveyImages(surveyId); // delete stored images for built-in image Page Items
                _surveys.Delete(surveyId);
            }
        }

        /// <summary>
        /// Edit the name of a Survey.
        /// </summary>
        /// <param name="id">The ID of the Survey to edit.</param>
        /// <param name="name">The new name for the Survey.</param>
        /// <exception cref="KeyNotFoundException">If the Survey cannot be found.</exception>
        public void EditName(int id, string name) => _surveys.UpdateName(id, name);

        /// <summary>
        /// Configure a Survey for the next Instance run
        /// </summary>
        /// <param name="id">The ID of the Survey to Configure.</param>
        /// <param name="config">A model of configuration values</param>
        public void Configure(int id, ConfigureSurveyModel config)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            survey.OneTimeParticipants = config.OneTimeParticipants;
            survey.UseParticipantIdentifiers = config.UseParticipantIdentifiers;
            survey.ValidIdentifiers = config.ValidIdentifiers;
            _surveys.Update(survey);
        }

        /// <summary>
        /// Update a Survey's Type Settings
        /// </summary>
        /// <param name="id">ID of the Survey to update</param>
        /// <param name="settings">New settings</param>
        public void EditSettings(int id, JObject settings)
        {
            var survey = _surveys.Find(id) ?? throw new KeyNotFoundException();
            survey.Settings = settings;
            _surveys.Update(survey);
        }
    }
}
