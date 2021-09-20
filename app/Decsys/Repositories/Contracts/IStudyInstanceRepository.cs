using Decsys.Models;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Decsys.Repositories.Contracts
{
    public interface IStudyInstanceRepository
    {
        /// <summary>
        /// Record the allocation of a Participant to a Child Survey Instance of the given Study Instance.
        /// </summary>
        /// <param name="studyInstanceId"></param>
        /// <param name="participantId"></param>
        /// <param name="targetInstanceId"></param>
        /// <returns></returns>
        SurveyInstance RecordCustomAllocation(int studyInstanceId, string participantId, int targetInstanceId);

        /// <summary>
        /// Find the Survey Instance to which a Study Participant has been allocated,
        /// or null if they have not yet been allocated.
        /// </summary>
        /// <param name="studyInstanceId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        SurveyInstance? FindAllocatedInstance(int studyInstanceId, string participantId);

        /// <summary>
        /// Allocate the participant to the next Survey Instance
        /// via a Block Randomisation strategy
        /// </summary>
        /// <param name="studyInstanceId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        Task<SurveyInstance> AllocateNext_Block(int studyInstanceId, string participantId);

        /// <summary>
        /// An export list of all allocations for this Study Instance
        /// </summary>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        List<StudySurveyAllocation> ListAllocations(int instanceId);

        /// <summary>
        /// An export list of the Blocked Randomisation List for this Study Instance
        /// </summary>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        List<RandListEntry> RandList(int instanceId);
    }
}
