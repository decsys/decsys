using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using LiteDB;

namespace Decsys.Services
{
    public class ParticipantEventService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;

        public ParticipantEventService(LiteDatabase db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        private string GetCollectionName(int instanceId, string participantId)
            => $"{Collections.EventLog}{instanceId}_{participantId}";

        /// <summary>
        /// Log a new event
        /// </summary>
        /// <param name="instanceId">ID of a Survey Isntance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="e">An event model, containing the source and type of the event, and a payload</param>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public void Log(int instanceId, string participantId, Models.ParticipantEvent e)
        {
            if (!_db.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");
            
            var log = _db.GetCollection<ParticipantEvent>(
                GetCollectionName(instanceId, participantId));

            log.Insert(_mapper.Map<ParticipantEvent>(e));
        }

        /// <summary>
        /// Get the most recent log entry for the given parameters
        /// </summary>
        /// <param name="instanceId">ID of a Survey Instance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="source">Source of the event (e.g. component id)</param>
        /// <param name="type">Type of the event (e.g. Results)</param>
        /// <returns>The Event Log entry, or null if there isn't one matching the criteria.</returns>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public Models.ParticipantEvent Last(int instanceId, string participantId, string source, string type)
        {
            if (!_db.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.GetCollection<ParticipantEvent>(
                GetCollectionName(instanceId, participantId));

            return _mapper.Map<Models.ParticipantEvent>(
                log.Find(x => x.Source == source && x.Type == type)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault());
        }

        // TODO: Participant state? Flat Participant Results? Other...?
    }
}
