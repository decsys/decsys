using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;

using LiteDB;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbParticipantEventRepository : IParticipantEventRepository
    {
        private readonly LiteDbFactory _db;
        private readonly IMapper _mapper;

        public LiteDbParticipantEventRepository(LiteDbFactory db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        #region Private Helpers

        /// <summary>
        /// Find the EventLog collection for a specific Participant
        /// </summary>
        /// <param name="instanceId">ID of the Instance to search</param>
        /// <param name="participantId">ID of the Participant to search for</param>
        private ILiteCollection<ParticipantEvent> FindLog(int instanceId, string participantId)
        {
            var db = _db.InstanceEventLogs(instanceId);

            var lookupId = db
                .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                .FindOne(x => x.ParticipantId == participantId)?.Id;

            if (lookupId is null)
            {
                lookupId = db
                    .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                    .Insert(new EventLogLookup { ParticipantId = participantId });
            }

            return db.GetCollection<ParticipantEvent>($"{Collections.EventLog}{lookupId}");
        }

        /// <summary>
        /// Get an EventLog collection directly by name
        /// </summary>
        /// <param name="instanceId"></param>
        /// <param name="collectionName"></param>
        private ILiteCollection<ParticipantEvent> GetLog(int instanceId, string collectionName)
            => _db.InstanceEventLogs(instanceId).GetCollection<ParticipantEvent>(collectionName);

        
        #endregion
        
        
        public string GetParticipantId(int instanceId, string collectionName)
            => _db.InstanceEventLogs(instanceId)
                    .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                    .FindOne(x => x.Id.ToString() == collectionName.Substring(1))?
                    .ParticipantId
                ?? throw new KeyNotFoundException(
                    $"Couldn't find the requested logs collection (id: {collectionName}) " +
                    $"for the specified Survey Instance (id: {instanceId})");
        
        public List<string> ListLogs(int instanceId)
            => _db.InstanceEventLogs(instanceId)
                .GetCollectionNames()
                .Where(x => x.StartsWith(Collections.EventLog))
                .ToList();
        
        public int GetParticipantCount(int instanceId)
            => ListLogs(instanceId).Count;
        
        public void Delete(int instanceId)
            => _db.DropInstanceEventLog(instanceId);

        public List<Models.ParticipantEvent> List(
            int instanceId,
            string participantId,
            string? source = null,
            string? type = null)
            => _mapper.Map<List<Models.ParticipantEvent>>(
                FindLog(instanceId, participantId)
                    .Find(x =>
                        (source == null || x.Source == source) &&
                        (type == null || x.Type == type))
                    .OrderBy(x => x.Timestamp));

        public Dictionary<string, List<Models.ParticipantEvent>> List(int instanceId, string? type = null)
            => ListLogs(instanceId)
                .ToDictionary(
                    x => GetParticipantId(instanceId, x),
                    x => _mapper.Map<List<Models.ParticipantEvent>>(
                        GetLog(instanceId, x)
                            .Find(x => type == null || x.Type == type)
                            .OrderBy(x => x.Timestamp)));

        public string NextParticipantId(int instanceId, string participantIdPrefix)
        {
            // get collections matching the prefix
            var logCollections = _db.InstanceEventLogs(instanceId)
                .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                .Find(x => x.ParticipantId.StartsWith(participantIdPrefix))
                .OrderByDescending(x => x.ParticipantId)
                .ToList();

            var latestLog = logCollections.FirstOrDefault();
            if (latestLog is null) return participantIdPrefix;

            var log = FindLog(instanceId, latestLog.ParticipantId);

            return log.Find(x => x.Type == EventTypes.SURVEY_COMPLETE).Any()
                ? $"{participantIdPrefix}-{logCollections.Count}"
                : latestLog.ParticipantId;
        }

        public void Create(int instanceId, string participantId, Models.ParticipantEvent e)
            => FindLog(instanceId, participantId)
                .Insert(_mapper.Map<ParticipantEvent>(e));
    }
}
