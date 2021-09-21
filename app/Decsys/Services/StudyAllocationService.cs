using AutoMapper;

using Decsys.Constants;
using Decsys.Models;
using Decsys.Repositories.Contracts;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Services
{
    public class StudyAllocationService
    {

        private readonly ISurveyInstanceRepository _instances;
        private readonly IStudyInstanceRepository _studyInstances;
        private readonly IParticipantEventRepository _events;
        private readonly MathService _math;
        private readonly IMapper _mapper;
        private readonly ISurveyRepository _surveys;

        public StudyAllocationService(
            ISurveyInstanceRepository instances,
            IStudyInstanceRepository studyInstances,
            IParticipantEventRepository events,
            MathService math,
            IMapper mapper,
            ISurveyRepository surveys)
        {
            _instances = instances;
            _studyInstances = studyInstances;
            _events = events;
            _math = math;
            _mapper = mapper;
            _surveys = surveys;
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

        internal StudyInstanceAllocationData Export(int instanceId)
        {
            var instance = _instances.Find(instanceId) ??
                throw new KeyNotFoundException("Study Instance could not be found.");

            var allocations = _studyInstances.ListAllocations(instanceId);
            var randList = _studyInstances.RandList(instanceId);

            var result = _mapper.Map<SurveyInstance, StudyInstanceAllocationData>(
                instance,
                // Automapper is to stupid to do this inside a profile?
                opt => opt.AfterMap((src, dest) =>
                    dest.ChildInstanceIds = src.Children.ConvertAll(x => x.Id)));

            result.Allocations = allocations;
            result.RandList = randList;

            return result;
        }

        public void ImportAllocationData(int studyId, StudyInstanceAllocationData allocationDataImport)
        {
            // Create the Study Instance
            var survey = _surveys.Find(studyId);
            if (survey is null) throw new KeyNotFoundException();

            var instance = _mapper.Map<SurveyInstance>(allocationDataImport);
            instance.Survey = survey;
            instance.Children = allocationDataImport.ChildInstanceIds.ConvertAll(
                // the child instance we put here is irrelevant; it's just transport for the id
                childId => new SurveyInstance(new("__DUMMY__")) { Id = childId });
            var instanceId = _instances.Create(instance);

            // Bulk Insert Allocations
            _studyInstances.ImportAllocations(instanceId, allocationDataImport.Allocations);

            // Bulk Insert RandList
            _studyInstances.ImportRandList(instanceId, allocationDataImport.RandList);
        }

        #region Service level Randomisation Strategy Implementations

        private int Minimisation_v1(Dictionary<int, int> factors, int weightPower = 1)
        {
            // Greatest Common Divisor will allow us to squash the factor values
            // This gives us more reasonable weights for the weighting math in the case of high factor values
            var gcd = MathService.Gcd(factors.Values.ToList());

            return _math.PickRandomWeightedItem(factors
                .Select(x => {
                    // 1. Use GCD to squash,
                    // 2. add 1 to every value to avoid divide by zero (also 0 should have the highest chance of selection anyway)
                    // 3. invert the value (1/) so the highest factor values have the lowest weight
                    var factorValue = gcd == 0
                        ? 1 // if gcd is 0, then all values are 0 so we should evenly weight everything at 1
                        : ((x.Value / gcd) + 1d);

                    // here we optionally increase the weight of higher factors
                    // to a specified power
                    var weightedFactorValue = Math.Pow(factorValue, weightPower);

                    return (item: x.Key, weight: 1 / weightedFactorValue);
                })
                .ToList());
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
