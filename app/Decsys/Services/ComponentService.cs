using System;
using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Data;
using Decsys.Data.Entities;

using LiteDB;

using Newtonsoft.Json.Linq;

namespace Decsys.Services
{
    /// <summary>
    /// Survey Page functionality
    /// </summary>
    public class ComponentService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;
        private readonly ImageService _images;

        public ComponentService(LiteDbFactory db, IMapper mapper, ImageService images)
        {
            _db = db.Surveys;
            _mapper = mapper;
            _images = images;
        }


        public Models.Component Create(int id, Guid pageId, string type)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException();

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException(); ;

            var entity = new Component(type);

            var components = page.Components.OrderBy(x => x.Order).ToList();

            components.Add(entity);

            page.Components = components.Select((x, i) => { x.Order = i + 1; return x; });

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);

            surveys.Update(survey);

            return _mapper.Map<Models.Component>(entity);
        } 

        public void Move(int id, Guid pageId, Guid componentId, int targetPosition)
        {
            if (targetPosition <= 0) targetPosition = 1; //silently fix this

            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id);
            if (survey is null) throw new KeyNotFoundException("Survey could not be found.");

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var components = page.Components.OrderBy(x => x.Order).ToList();

            if (targetPosition > components.Count) targetPosition = components.Count; // silently fix this

            var component = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            if (targetPosition == component.Order) return; // job done ;)

            if (targetPosition > component.Order)
            {
                // moving upwards:
                // 1. Insert the component later
                // 2. Delete the old component
                var iPage = components.IndexOf(component);
                components.Insert(targetPosition, component);
                components.RemoveAt(iPage);
            }
            else
            {
                // moving downwards:
                // 1. Delete the old component
                // 2. Insert the page at the new position
                components.Remove(component);
                components.Insert(targetPosition - 1, component);
            }

            page.Components = components.Select((x, i) => { x.Order = i + 1; return x; });

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);
            surveys.Update(survey);
        }


        internal void ClearParam(int id, Guid pageId, Guid componentId, string paramKey)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var components = page.Components.ToList();
            var entity = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            var component = _mapper.Map<Models.Component>(entity);
            component.Params.Remove(paramKey);

            components[components.IndexOf(entity)] = _mapper.Map<Component>(component);

            page.Components = components;

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);
            surveys.Update(survey);
        }


        public bool Delete(int id, Guid pageId, Guid componentId)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id);
            if (survey is null) return false;

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId);
            if (page is null) return false;

            var component = page.Components.ToList().SingleOrDefault(x => x.Id == componentId);
            if (component is null) return false;

            if (component.Type == "image")
                _images.RemoveFile(id, pageId, componentId);

            var components = page.Components.ToList();
            components.Remove(component);
            page.Components = components.Select((x, i) => { x.Order = i + 1; return x; });

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);
            surveys.Update(survey);

            return true;
        }

 
        public void MergeParams(int id, Guid pageId, Guid componentId, JObject componentParams)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var components = page.Components.ToList();
            var entity = components.SingleOrDefault(x => x.Id == componentId)
                ?? throw new KeyNotFoundException("Component could not be found.");

            var component = _mapper.Map<Models.Component>(entity);
            component.Params.Merge(componentParams);

            components[components.IndexOf(entity)] = _mapper.Map<Component>(component);

            page.Components = components;

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);
            surveys.Update(survey);
        }

        public Models.Component Duplicate(int id, Guid pageId, Guid componentId)
        {
            var surveys = _db.GetCollection<Survey>(Collections.Surveys);
            var survey = surveys.FindById(id)
                ?? throw new KeyNotFoundException("Survey could not be found.");

            var page = survey.Pages.SingleOrDefault(x => x.Id == pageId)
                ?? throw new KeyNotFoundException("Page could not be found.");

            var components = page.Components.ToList();
            var i = components.FindIndex(x => x.Id == componentId);
            if (i < 0) throw new KeyNotFoundException("Component could not be found.");
            var component = components[i];

            // manual deep copy
            var dupe = new Component(component.Type)
            {
                Id = Guid.NewGuid(),
                Order = components.Count + 1,
                Params = component.Params
            };
            components.Insert(i + 1, dupe);

            _images.CopyFile(id, pageId, componentId, dupe.Id);

            page.Components = components.Select((x, i) => { x.Order = i + 1; return x; }); ;

            survey.Pages = survey.Pages.Select(x => x.Id == pageId ? page : x);
            surveys.Update(survey);

            return _mapper.Map<Models.Component>(dupe);
        }
    }
}
