﻿
using AutoMapper;

using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities;
using Decsys.Data.Entities.Mongo;
using Decsys.Repositories.Contracts;
using Decsys.Services;
using Decsys.Services.Contracts;

using Microsoft.Extensions.Options;

using MongoDB.Bson;
using MongoDB.Driver;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Decsys.Repositories.Mongo
{
    public class StudyInstanceRepository : IStudyInstanceRepository
    {
        private readonly HostedDbSettings _config;
        private readonly IMongoClient _mongo;
        private readonly ISurveyInstanceRepository _instances;
        private readonly ILockProvider _locks;
        private readonly MathService _math;
        private readonly IMapper _mapper;

        public StudyInstanceRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            ISurveyInstanceRepository instances,
            ILockProvider locks,
            MathService math,
            IMapper mapper)
        {
            _config = config.Value;
            _mongo = mongo;
            _instances = instances;
            _locks = locks;
            _math = math;
            _mapper = mapper;
        }

        private int GetNextAllocationId(int studyInstanceId)
        {
            // mongo has no integer id generator
            // so we set integer id's at insert
            var lastId = Allocations(studyInstanceId)
                .Find(new BsonDocument())
                .SortByDescending(x => x.Id)
                .FirstOrDefault()?
                .Id ?? 0;

            return ++lastId;
        }

        private int GetNextRandListId(int studyInstanceId)
        {
            // mongo has no integer id generator
            // so we set integer id's at insert
            var lastId = RandList(studyInstanceId)
                .Find(new BsonDocument())
                .SortByDescending(x => x.Id)
                .FirstOrDefault()?
                .Id ?? 0;

            return ++lastId;
        }

        private IMongoDatabase InstanceDb(int studyInstanceId)
            => _mongo.GetDatabase(
                $"{_config.DatabaseName}_{Collections.InstanceDb}{studyInstanceId}");

        private IMongoCollection<RandListEntry> RandList(int studyInstanceId)
            => InstanceDb(studyInstanceId).GetCollection<RandListEntry>(Collections.RandList);

        private IMongoCollection<StudySurveyAllocation> Allocations(int studyInstanceId)
            => InstanceDb(studyInstanceId).GetCollection<StudySurveyAllocation>(Collections.StudySurveyAllocations);

        public async Task<Models.SurveyInstance> AllocateNext_Block(int studyInstanceId, string participantId)
        {
            using (await _locks.AcquireLock($"{studyInstanceId}_{Collections.RandList}"))
            {
                var randList = RandList(studyInstanceId);

                var nextRand = (await randList.FindAsync(x => x.AllocationId == null,
                    new FindOptions<RandListEntry, RandListEntry>()
                    {
                        Limit = 1,
                        Sort = Builders<RandListEntry>.Sort.Ascending(x => x.Id)
                    })).FirstOrDefault();

                if (nextRand is null)
                {
                    // dynamically generate a new block
                    // and then use the first value in it
                    nextRand = await GenerateNewBlock(studyInstanceId);
                }

                var allocationId = GetNextAllocationId(studyInstanceId);
                Allocations(studyInstanceId).InsertOne(
                    new(participantId, nextRand.InstanceId)
                    {
                        Id = allocationId
                    });

                nextRand.AllocationId = allocationId;

                randList.ReplaceOne(x => x.Id == nextRand.Id, nextRand);

                return _instances.Find(nextRand.InstanceId)
                    ?? throw new InvalidOperationException(
                        $"RandList contains invalid Survey Instance ID {nextRand.InstanceId} for Study Instance {studyInstanceId}");
            }
        }

        public Models.SurveyInstance? FindAllocatedInstance(int studyInstanceId, string participantId)
        {
            var allocation = Allocations(studyInstanceId)
                .Find(x => x.ParticipantId == participantId)
                .SingleOrDefault();

            if (allocation is not null)
                return _instances.Find(allocation.InstanceId)
                    ?? throw new InvalidOperationException(
                        $"Could not find the allocated Survey Instance, with Instance ID: {allocation.InstanceId}.");

            return null;
        }

        public Models.SurveyInstance RecordCustomAllocation(int studyInstanceId, string participantId, int targetInstanceId)
        {
            var instance = _instances.Find(targetInstanceId) ?? throw new KeyNotFoundException();

            Allocations(studyInstanceId).InsertOne(
                new(participantId, targetInstanceId)
                {
                    Id = GetNextAllocationId(studyInstanceId)
                });

            return instance;
        }

        /// <summary>
        /// Generate a new RandList Block for the child Survey Instances in the given Study Instance
        /// </summary>
        /// <param name="studyInstanceId"></param>
        /// <returns>The first entry from the newly generated block</returns>
        private async Task<RandListEntry> GenerateNewBlock(int studyInstanceId)
        {
            var study = _instances.Find(studyInstanceId)
                ?? throw new KeyNotFoundException();

            var randList = RandList(studyInstanceId);

            var lastBlockNumber = (await randList
                .FindAsync(FilterDefinition<RandListEntry>.Empty,
                    new FindOptions<RandListEntry, RandListEntry>()
                    {
                        Limit = 1,
                        Sort = Builders<RandListEntry>.Sort.Descending(x => x.Block)
                    }))
                .FirstOrDefault()?
                .Block ?? 0;

            var nextEntryId = GetNextRandListId(studyInstanceId);

            var entries = study.Children.ConvertAll(x => new RandListEntry
            {
                Id = nextEntryId++, // TODO: does this work?
                Block = lastBlockNumber + 1,
                InstanceId = x.Id
            });

            _math.Shuffle(ref entries);

            randList.InsertMany(entries);

            return entries[0];
        }

        public List<Models.StudySurveyAllocation> ListAllocations(int instanceId)
            => _mapper.Map<List<Models.StudySurveyAllocation>>(
                Allocations(instanceId).Find(new BsonDocument()).ToList());

        List<Models.RandListEntry> IStudyInstanceRepository.RandList(int instanceId)
            => _mapper.Map<List<Models.RandListEntry>>(
                RandList(instanceId).Find(new BsonDocument()).ToList());

        public void ImportAllocations(int instanceId, List<Models.StudySurveyAllocation> allocations)
        {
            Allocations(instanceId).DeleteMany(new BsonDocument());
            Allocations(instanceId).InsertMany(
                _mapper.Map<List<StudySurveyAllocation>>(allocations));
        }

        public void ImportRandList(int instanceId, List<Models.RandListEntry> randList)
        {
            RandList(instanceId).DeleteMany(new BsonDocument());
            RandList(instanceId).InsertMany(
                _mapper.Map<List<RandListEntry>>(randList));
        }
    }
}
