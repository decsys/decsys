﻿using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Repositories.Contracts;

using Microsoft.Extensions.Options;

using MongoDB.Bson;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo
{
    public class ParticipantEventRepository : IParticipantEventRepository
    {
        private readonly HostedDbSettings _config;
        private readonly IMongoClient _mongo;
        private readonly IMapper _mapper;

        public ParticipantEventRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IMapper mapper)
        {
            _config = config.Value;
            _mongo = mongo;
            _mapper = mapper;
        }

        public int GetParticipantCount(int instanceId)
            => ListLogs(instanceId).Count;

        private IMongoDatabase EventLogDb(int instanceId)
            => _mongo.GetDatabase(
                $"{_config.DatabaseName}_{Collections.InstanceDb}{instanceId}");

        public List<string> ListLogs(int instanceId)
            => EventLogDb(instanceId)
                .ListCollectionNames().ToList()
                .Where(x => x.StartsWith($"{Collections.EventLog}_"))
                .ToList();

        private IMongoCollection<ParticipantEvent> FindLog(int instanceId, string participantId)
            => EventLogDb(instanceId).GetCollection<ParticipantEvent>(
                $"{Collections.EventLog}_{participantId}");

        private IMongoCollection<ParticipantEvent> GetLog(int instanceId, string collectionName)
            => EventLogDb(instanceId).GetCollection<ParticipantEvent>(collectionName);

        public string GetParticipantId(int instanceId, string collectionName)
            => GetParticipantId(collectionName);
        
        private string GetParticipantId(string collectionName)
            => collectionName.Substring($"{Collections.EventLog}_".Length);

        public void Create(int instanceId, string participantId, Models.ParticipantEvent e)
        {
            var log = FindLog(instanceId, participantId);

            var entity = _mapper.Map<ParticipantEvent>(e);

            log.InsertOne(entity);
        }

        public List<Models.ParticipantEvent> List(int instanceId, string participantId, string? source = null, string? type = null)
            => _mapper.Map<List<Models.ParticipantEvent>>(
                FindLog(instanceId, participantId)
                    .Find(x =>
                        (source == null || x.Source == source) &&
                        (type == null || x.Type == type))
                    .SortBy(x => x.Timestamp)
                    .ToList());

        public Dictionary<string, List<Models.ParticipantEvent>> List(int instanceId, string? type = null)
            => ListLogs(instanceId)
                .ToDictionary(
                    GetParticipantId,
                    x =>
                    {
                        return _mapper.Map<List<Models.ParticipantEvent>>(
                            GetLog(instanceId, x)
                                .Find(x => type == null || x.Type == type)
                                .SortBy(x => x.Timestamp)
                                .ToList());
                    });

        public string NextParticipantId(int instanceId, string participantIdPrefix)
        {
            var logCollections = EventLogDb(instanceId)
                .ListCollectionNames().ToList()
                .Where(x => GetParticipantId(x).StartsWith(participantIdPrefix))
                .OrderByDescending(GetParticipantId)
                .ToList();

            var latestLog = logCollections.FirstOrDefault();
            if (latestLog is null) return participantIdPrefix;

            var latestPid = GetParticipantId(latestLog);
            var log = FindLog(instanceId, latestPid);

            return log.Find(x => x.Type == EventTypes.SURVEY_COMPLETE).Any()
                ? $"{participantIdPrefix}-{logCollections.Count}"
                : latestPid;
        }

        public void Delete(int instanceId)
        {
            var db = EventLogDb(instanceId);
            db.Client.DropDatabase(db.DatabaseNamespace.DatabaseName);
        }
    }
}
