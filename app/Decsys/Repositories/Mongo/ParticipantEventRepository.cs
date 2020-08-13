using System.Collections.Generic;
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

        private IMongoDatabase EventLogDb(int instanceId)
            => _mongo.GetDatabase(
                $"{_config.DatabaseName}_{Collections.EventLogDb}{instanceId}");

        private List<string> ListLogs(int instanceId)
            => EventLogDb(instanceId)
                .ListCollectionNames().ToList()
                .Where(x => x.StartsWith($"{Collections.EventLog}_"))
                .ToList();

        private IMongoCollection<ParticipantEvent> FindLog(int instanceId, string participantId)
            => EventLogDb(instanceId).GetCollection<ParticipantEvent>(
                $"{Collections.EventLog}_{participantId}");

        private IMongoCollection<ParticipantEvent> GetLog(int instanceId, string collectionName)
            => EventLogDb(instanceId).GetCollection<ParticipantEvent>(collectionName);

        private string GetParticipantId(string collectionName)
            => collectionName.Substring($"{Collections.EventLog}_".Length);

        private int GetNextEventId(IMongoCollection<ParticipantEvent> log)
        {
            // mongo has no integer id generator
            // so we set integer id's at insert
            // TODO: this has the same issue as LiteDb
            // in that it will restart from 1
            // if all records are deleted
            var lastId = log.Find(new BsonDocument())
                .SortByDescending(x => x.Id)
                .FirstOrDefault()?
                .Id ?? 0;

            return ++lastId;

        }

        public void Create(int instanceId, string participantId, Models.ParticipantEvent e)
        {
            var log = FindLog(instanceId, participantId);

            var entity = _mapper.Map<ParticipantEvent>(e);
            entity.Id = GetNextEventId(log);

            log.InsertOne(entity);
        }

        public List<Models.ParticipantEvent> List(int instanceId, string participantId, string? source = null, string? type = null)
            => _mapper.Map<List<Models.ParticipantEvent>>(
                FindLog(instanceId, participantId)
                    .Find(x =>
                        (source == null || x.Source == source) &&
                        (type == null || x.Type == type))
                    .SortBy(x => x.Timestamp));

        public Dictionary<string, List<Models.ParticipantEvent>> List(int instanceId)
            => ListLogs(instanceId)
                .ToDictionary(
                    GetParticipantId,
                    x => _mapper.Map<List<Models.ParticipantEvent>>(
                        GetLog(instanceId, x)
                            .Find(new BsonDocument())
                            .SortBy(x => x.Timestamp)));

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
    }
}
