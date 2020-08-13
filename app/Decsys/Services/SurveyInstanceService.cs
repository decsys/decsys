using System;
using System.Collections.Generic;
using AutoMapper;
using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Services
{
    public class SurveyInstanceService
    {
        private readonly ISurveyInstanceRepository _instances;
        private readonly ISurveyRepository _surveys;
        private readonly IParticipantEventRepository _events;
        private readonly IMapper _mapper;

        public SurveyInstanceService(
            ISurveyInstanceRepository instances,
            ISurveyRepository surveys,
            IParticipantEventRepository events,
            IMapper mapper)
        {
            _instances = instances;
            _surveys = surveys;
            _events = events;
            _mapper = mapper;
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

            if (instance?.Survey.Id != surveyId) throw new KeyNotFoundException();

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
        /// <param name="instances">Instance data to import</param>
        /// <param name="targetSurveyId">ID of the Survey to import to</param>
        public void Import(IList<SurveyInstanceResults<ParticipantEvents>> instances, int targetSurveyId)
        {
            var survey = _surveys.Find(targetSurveyId);
            if (survey is null) throw new KeyNotFoundException();

            foreach (var instanceImport in instances)
            {
                var instance = _mapper.Map<SurveyInstance>(instanceImport);
                instance.Survey = survey;
                var instanceId = _instances.Create(instance);

                foreach (var participant in instanceImport.Participants)
                    foreach (var e in participant.Events)
                        _events.Create(instanceId, participant.Id, e);
            }
        }
    }
}
