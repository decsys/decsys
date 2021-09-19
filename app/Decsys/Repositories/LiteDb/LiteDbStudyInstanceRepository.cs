using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;
using Decsys.Services;
using Decsys.Services.Contracts;

using LiteDB;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbStudyInstanceRepository : IStudyInstanceRepository
    {
        private readonly LiteDbFactory _db;
        private readonly ISurveyInstanceRepository _instances;
        private readonly ILockProvider _locks;
        private readonly MathService _math;

        public LiteDbStudyInstanceRepository(
            LiteDbFactory db,
            ISurveyInstanceRepository instances,
            ILockProvider locks,
            MathService math)
        {
            _db = db;
            _instances = instances;
            _locks = locks;
            _math = math;
        }

        #region Helpers

        private ILiteCollection<RandListEntry> RandList(int instanceId)
            => _db.InstanceEventLogs(instanceId).GetCollection<RandListEntry>(Collections.RandList);

        private ILiteCollection<StudySurveyAllocation> Allocations(int instanceId)
            => _db.InstanceEventLogs(instanceId).GetCollection<StudySurveyAllocation>(Collections.StudySurveyAllocations);

        #endregion

        public Models.SurveyInstance RecordCustomAllocation(int studyInstanceId, string participantId, int targetInstanceId)
        {
            var instance = _instances.Find(targetInstanceId) ?? throw new KeyNotFoundException();

            Allocations(studyInstanceId).Insert(new StudySurveyAllocation(participantId, targetInstanceId));

            return instance;
        }

        public Models.SurveyInstance? FindAllocatedInstance(int studyInstanceId, string participantId)
        {
            var allocation = Allocations(studyInstanceId).FindOne(x => x.ParticipantId == participantId);

            if (allocation is not null)
                return _instances.Find(allocation.InstanceId)
                    ?? throw new InvalidOperationException(
                        $"Could not find the allocated Survey Instance, with Instance ID: {allocation.InstanceId}.");

            return null;
        }

        // Built in allocation strategies

        public async Task<Models.SurveyInstance> AllocateNext_Block(int studyInstanceId, string participantId)
        {
            using (await _locks.AcquireLock($"{studyInstanceId}_{Collections.RandList}"))
            {
                var randList = RandList(studyInstanceId);

                var nextRand = randList.FindOne(x => x.Allocation == null);

                if (nextRand is null)
                {
                    // dynamically generate a new block
                    // and then use the first value in it
                    nextRand = GenerateNewBlock(studyInstanceId);
                }

                nextRand.Allocation = new(participantId, nextRand.InstanceId);

                randList.Update(nextRand);

                return _instances.Find(nextRand.InstanceId)
                    ?? throw new InvalidOperationException(
                        $"RandList contains invalid Survey Instance ID {nextRand.InstanceId} for Study Instance {studyInstanceId}");
            }
        }

        /// <summary>
        /// Generate a new RandList Block for the child Survey Instances in the given Study Instance
        /// </summary>
        /// <param name="studyInstanceId"></param>
        /// <returns>The first entry from the newly generated block</returns>
        private RandListEntry GenerateNewBlock(int studyInstanceId)
        {
            var study = _instances.Find(studyInstanceId)
                ?? throw new KeyNotFoundException();

            var randList = RandList(studyInstanceId);

            var lastBlockNumber = randList.Count() > 0
                ? randList.Max(x => x.Block)
                : 0;

            var entries = study.Children.ConvertAll(x => new RandListEntry
            {
                Block = lastBlockNumber + 1,
                InstanceId = x.Id
            });

            _math.Shuffle(ref entries);

            randList.Insert(entries);

            return entries[0];
        }
    }
}
