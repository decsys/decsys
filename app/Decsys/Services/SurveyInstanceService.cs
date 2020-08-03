using System;
using System.Collections.Generic;

using AutoMapper;

using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Services
{
    // TODO: Doc Comments!
    public class SurveyInstanceService
    {
        private readonly ISurveyInstanceRepository _instances;
        private readonly ISurveyRepository _surveys;

        public SurveyInstanceService(ISurveyInstanceRepository instances, ISurveyRepository surveys)
        {
            _instances = instances;
            _surveys = surveys;
        }

        /// <summary>
        /// Create a new SurveyInstance
        /// </summary>
        /// <param name="surveyId">ID of the Survey to create an Instance of</param>
        public int Create(int surveyId)
        {
            var survey = _surveys.Find(surveyId) ?? throw new KeyNotFoundException();

            if (_instances.HasActiveInstance(surveyId))
                throw new ArgumentException(
                    $"The Survey with the id '{surveyId}' currently has an active Survey Instance.",
                    nameof(surveyId));

            var instance = new SurveyInstance(survey)
            {
                // Preserve the Survey Config at the time of this Instance launch
                OneTimeParticipants = survey.OneTimeParticipants,
                UseParticipantIdentifiers = survey.UseParticipantIdentifiers,
                ValidIdentifiers = survey.ValidIdentifiers
            };

            return _instances.Create(instance);
        }

        /// <summary>
        /// Get a SurveyInstance
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        /// <param name="instanceId">ID of the Instance</param>
        public SurveyInstance Get(int surveyId, int instanceId)
        {
            if (!_surveys.Exists(surveyId))
                throw new KeyNotFoundException();

            var instance = _instances.Find(instanceId);

            if (instance.Survey.Id != surveyId) throw new KeyNotFoundException();

            return instance;
        }

        /// <summary>
        /// List all Instances of a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        public IEnumerable<SurveyInstance> List(int surveyId)
        {
            if (!_surveys.Exists(surveyId))
                throw new KeyNotFoundException();

            return _instances.List(surveyId);
        }

        /// <summary>
        /// Close an Instance of a Survey
        /// </summary>
        /// <param name="surveyId">ID of the Survey</param>
        /// <param name="instanceId">ID of the Instance to close</param>
        public void Close(int surveyId, int instanceId)
        {
            if (!_surveys.Exists(surveyId))
                throw new KeyNotFoundException();

            var instance = _instances.Find(instanceId);
            if (instance?.Survey.Id != surveyId) throw new KeyNotFoundException();

            _instances.Close(instanceId);
        }

        /// <summary>
        /// Import Instances to a target Survey
        /// </summary>
        /// <param name="instanceModels">Instance data to import</param>
        /// <param name="targetSurveyId">ID of the Survey to import to</param>
        // TODO: blocked by EventLog Repo
        //public void Import(IList<SurveyInstanceResults<ParticipantEvents>> instanceModels, int targetSurveyId)
        //{
        //    var survey = _surveys.Get(targetSurveyId);
        //    if (survey is null) throw new KeyNotFoundException();



        //    foreach (var instanceModel in instanceModels)
        //    {
        //        var instance = _mapper.Map<SurveyInstance>(instanceModel);
        //        instance.Survey = survey;
        //        var instanceId = _instances.Insert(instance);

        //        foreach (var participant in instanceModel.Participants)
        //        {
        //            var log = _db.InstanceEventLogs(instanceId).GetCollection<ParticipantEvent>(
        //            ParticipantEventService.GetCollectionName(participant.Id, _db.InstanceEventLogs(instanceId)));

        //            foreach (var e in participant.Events)
        //            {
        //                log.Insert(_mapper.Map<ParticipantEvent>(e));
        //            }
        //        }
        //    }
        //}
    }
}
