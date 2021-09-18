using Decsys.Constants;
using Decsys.Models;
using Decsys.Repositories.Contracts;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Services
{
    public class StudyRandomizationService
    {

        private readonly ISurveyInstanceRepository _instances;
        private readonly IStudyInstanceRepository _studyInstances;
        private readonly IParticipantEventRepository _events;
        private readonly MathService _math;

        public StudyRandomizationService(
            ISurveyInstanceRepository instances,
            IStudyInstanceRepository studyInstances,
            IParticipantEventRepository events,
            MathService math)
        {
            _instances = instances;
            _studyInstances = studyInstances;
            _events = events;
            _math = math;
        }

        public SurveyInstance? FindAllocatedInstance(int studyInstanceId, string participantId)
            => _studyInstances.FindAllocatedInstance(studyInstanceId, participantId);

        public async Task<SurveyInstance> AllocateNext(int studyInstanceId, string participantId)
        {
            var study = _instances.Find(studyInstanceId)
                ?? throw new KeyNotFoundException();

            switch (study.RandomisationStrategy?.Strategy)
            {
                case RandomisationStrategies.Block:
                    return await _studyInstances.AllocateNext_Block(studyInstanceId, participantId);

                case RandomisationStrategies.Minimisation:
                    {
                        var instanceId = Minimisation_v1(GetMinimisationFactors(study));
                        return _studyInstances.RecordCustomAllocation(studyInstanceId, participantId, instanceId);
                    }

                case RandomisationStrategies.Hybrid:
                    {
                        var factors = GetMinimisationFactors(study);
                        if (factors.All(x => x.Value == factors.Values.First()))
                        {
                            // if the factors are all equal, then minimisation is not required as there will be no weighting
                            // in which case we fall back to the blocked randlist
                            return await _studyInstances.AllocateNext_Block(studyInstanceId, participantId);
                        }
                        else
                        {
                            var instanceId = Minimisation_v1(GetMinimisationFactors(study));
                            return _studyInstances.RecordCustomAllocation(studyInstanceId, participantId, instanceId);
                        }
                    }

                default:
                    throw new ArgumentException(
                        $"The Study Instance with ID {studyInstanceId} does not have a vaild Randomisation Strategy.",
                        nameof(studyInstanceId));
            }
        }

        #region Service level Randomisation Strategy Implementations

        private int Minimisation_v1(Dictionary<int, int> factors)
        {
            List<int> randSource = new();
            // 1. reduce weights to smallest integer values
            // and 2. build a weighted list of surveys
            var gcd = MathService.Gcd(factors.Values.ToList());
            foreach (var surveyFactor in factors)
            {
                randSource.AddRange(
                    Enumerable.Repeat(
                        surveyFactor.Key,
                        surveyFactor.Value / gcd)
                    .ToArray());
            }

            // 3. Shuffle the List for good measure
            _math.Shuffle(ref randSource);

            // 4. Randomly pick an item from the shuffled weighted list
            return randSource[_math.Random.Next(0, randSource.Count)];
        }

        private Dictionary<int, int> GetMinimisationFactors(SurveyInstance study)
        {
            Dictionary<int, int> factors = new();

            foreach (var childInstance in study.Children)
            {
                factors[childInstance.Id] = _events.List(childInstance.Id, EventTypes.SURVEY_COMPLETE).Sum(x => x.Value.Count);
            }

            return factors;
        }

        #endregion
    }
}
